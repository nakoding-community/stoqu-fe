pipeline {
    environment {
        hostName = "nakoding-nabawi-vps"
        secretConfig = "pos-frontend-${BRANCH_NAME}-secret"

        service = "nabawi-pos-frontend"
        version = "${BRANCH_NAME}.${BUILD_NUMBER}"

        registry = "registry.gitlab.com/nakoding-studio/$service"
        registryCredentials = "gitlab-dekur98-cred"
        dockerImage = ""
        dockerImageOld = "${registry}:${BRANCH_NAME}.${BUILD_NUMBER.toInteger() -2}"

        dockerComposeFile = "docker-compose.yml"
        dockerStack = "pos-service"

        APPROVED_DEPLOY = ""
    }

    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from branch ' + env.BRANCH_NAME
                checkout scm
            } 
        } 
        stage('Build') {
            steps {
                echo 'Building image'
                script {
                    dockerImage = docker.build registry
                }
            }
        }
        stage('Approval Step') {
            steps{
                script {
                    if (env.BRANCH_NAME == 'production') {
                        APPROVED_DEPLOY = input message: 'Deploy need confirmation',
                        parameters: [choice(name: 'Deploy?', choices: 'no\nyes', description: 'Choose "yes" if you want to deploy this build')]
                    } else {
                        script {
                            APPROVED_DEPLOY = 'yes'
                        }
                        echo 'No Need Confirmation ...'
                    }
                }
            }
        }
        stage('Publish') {
            when {
                equals expected: 'yes', actual: APPROVED_DEPLOY
            }
            steps {
                echo 'Publishing image'
                script {
                    docker.withRegistry("https://" + registry   , registryCredentials) {
                        dockerImage.push("$version")
                        dockerImage.push("latest")
                    }
                }
            }
        }
        stage('Preparation & Deployment') {
            when {
                equals expected: 'yes', actual: APPROVED_DEPLOY
            }
            stages {
                stage('Deployment') {
                    steps {
                        echo 'Deploying ...'
                        script {
                            withCredentials([usernamePassword(credentialsId: "gitlab-dekur98-cred", usernameVariable: "userName", passwordVariable: "password")]) {
                                sh "docker login -u=$userName -p=$password $registry"
                                sh "BRANCH=${BRANCH_NAME} IMAGE=$registry:$version docker stack deploy -c $dockerComposeFile $dockerStack --with-registry-auth"
                            }
                        }
                    }
                }
            }
        }
        // stage('Cleaning') {
        //     when {
        //         equals expected: 'yes', actual: APPROVED_DEPLOY
        //     }
        //     stages {
        //         stage("Removing unused image") {
        //              when {
        //                 expression {
        //                     dockerImageIDOld = sh(returnStdout: true, script: 'docker images ${dockerImageOld} --format "{{.ID}}"').trim()
        //                     return !dockerImageIDOld.isEmpty()
        //                 }
        //             }
        //             steps {
        //                 echo 'Removing unused image ...'
        //                 sh "docker rmi ${dockerImageOld}"
        //             }
        //         }
        //     }
        // }
    }
}