#!/bin/bash
#
# Keeping notes on steps run to set up jenkins in doctor.

set -e

function one_time_setup {
  docker network create jenkins
  docker volume create jenkins-docker-certs
  docker volume create jenkins-data
}

function start_jenkins_docker {
  docker container stop jenkins-docker || echo
  docker container run \
    --name jenkins-docker \
    --rm \
    --detach \
    --privileged \
    --network jenkins \
    --network-alias docker \
    --env DOCKER_TLS_CERTDIR=/certs \
    --mount 'type=volume,src=jenkins-docker-certs,dst=/certs/client' \
    --mount 'type=volume,src=jenkins-data,dst=/var/jenkins_home' \
    --publish 3000:3000 \
    docker:dind
}

function start_jenkins_blueocean {
  docker container stop jenkins-tutorial || echo
  docker container run \
    --name jenkins-tutorial \
    --rm \
    --detach \
    --network jenkins \
    --network-alias docker \
    --env DOCKER_HOST=tcp://docker:2376 \
    --env DOCKER_CERT_PATH=/certs/client \
    --env DOCKER_TLS_VERIFY=1 \
    --mount 'type=volume,src=jenkins-docker-certs,dst=/certs/client,readonly' \
    --mount 'type=volume,src=jenkins-data,dst=/var/jenkins_home' \
    --mount "type=bind,src=${HOME},dst=/home" \
    --publish 8080:8080 \
    jenkinsci/blueocean
}

function build_ci_container {
  docker build --tag covid-graphs-test:1.0 .
}

function interactive_debug {
  docker container stop debug || echo -n
  docker container run -it \
    --name debug \
    --rm \
    --detach \
    -p 3001:3001 \
    --mount "type=bind,src=${HOME},dst=/home" \
    covid-graphs-test:1.0
  # Start a shell in the container
  docker container exec -it debug /bin/sh
}

# one_time_setup
start_jenkins_docker
start_jenkins_blueocean
# interactive_debug
