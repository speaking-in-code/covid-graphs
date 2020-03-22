#!/bin/bash

set -e
readonly download=$(mktemp -t daily.json)
curl https://covidtracking.com/api/states/daily.json \
  -o "${download}"
npm run --silent json-format-tool -- --replace "${download}" > /dev/null
mv "${download}" src/assets/daily.json
