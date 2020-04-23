pipeline {
  agent {
    dockerfile {
      dir 'jenkins'
      args '-p 3000:3000'
    }
  }
  stages {
    stage('Install') {
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
    stage('Prod Build') {
      steps {
        sh 'npm run prod-build'
      }
    }
    stage('Prod Push') {
      environment {
        GOOGLE_APPLICATION_CREDENTIALS = credentials('corona-compare-pusher')
      }
      steps {
        sh 'npm run release'
      }
    }
  }
}
