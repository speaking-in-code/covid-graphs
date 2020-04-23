pipeline {
  agent {
    dockerfile true
    dir 'jenkins'
    args '-p 3000:3000'
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
