#!/bin/bash

# exit immediately if a pipeline fail
set -e

# check PROJECT_DIR variable
if [ -z ${PROJECT_DIR} ]
then
  echo variable \`PROJECT_DIR\` required
  exit 1
fi

# format docker variable
PROJECT_NAME=${PROJECT_NAME:-$(cd ${PROJECT_DIR} && basename ${PWD})}
DOCKER_IMAGE_NAME=${CI_PROJECT_NAMESPACE}-${PROJECT_NAME}
DOCKER_REPO=${DOCKER_REGISTRY}/${DOCKER_REGISTRY_NAMESPACE}/${DOCKER_IMAGE_NAME}
DOCKER_FILE=${PROJECT_DIR}/Dockerfile
if [ ! -f ${DOCKER_FILE} ]
then
  DOCKER_FILE=${PROJECT_DIR}/../Dockerfile
fi


# build docker image
docker build --pull --build-arg PROJECT_DIR=${PROJECT_DIR} -f ${DOCKER_FILE} -t ${DOCKER_REPO}:${CI_COMMIT_SHA} .

# tag docker image according to git branch or tag name
if [ "${CI_COMMIT_REF_SLUG}" == "master" ]
then
  docker tag ${DOCKER_REPO}:${CI_COMMIT_SHA} ${DOCKER_REPO}:latest
else
  docker tag ${DOCKER_REPO}:${CI_COMMIT_SHA} ${DOCKER_REPO}:${CI_COMMIT_REF_SLUG}
fi

# tag docker image according to git tag name
if [ "${CI_COMMIT_TAG}" != "" ]
then
  docker tag ${DOCKER_REPO}:${CI_COMMIT_SHA} ${DOCKER_REPO}:${CI_COMMIT_TAG}
fi

# login and push docker image
echo ${DOCKER_REGISTRY_PASSWORD} | docker login --username ${DOCKER_REGISTRY_USERNAME} --password-stdin ${DOCKER_REGISTRY}
docker push ${DOCKER_REPO}
