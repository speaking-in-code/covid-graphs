pipeline {
    agent {
        docker {
            image 'rastasheep/alpine-node-chromium:10-alpine'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test-headless'
            }
        }
    }
}
