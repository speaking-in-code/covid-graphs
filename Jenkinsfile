pipeline {
  agent {
    dockerfile {
      dir 'jenkins'
      args '-p 3000:3000'
    }
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Data Update') {
      steps {
        sh 'npm run update-data'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test:ci'
      }
    }
  }
}
