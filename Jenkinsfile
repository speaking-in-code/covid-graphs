pipeline {
    agent {
        docker {
            image 'node:10.20-alpine'
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
                sh 'npm run test:ci'
            }
        }
    }
}
