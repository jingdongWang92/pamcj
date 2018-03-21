#!/bin/bash

# exit immediately if a pipeline fail
set -e

# check PROJECT_DIR variable
if [ -z ${PROJECT_DIR} ]
then
  echo variable \`PROJECT_DIR\` required
  exit 1
fi

cd ${PROJECT_DIR}
yarn config set registry https://registry.npm.taobao.org/
yarn
yarn run build
