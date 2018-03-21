FROM fishead/node-jcnetwork:8-alpine

ARG PROJECT_DIR=.

COPY ${PROJECT_DIR}/package.json /usr/src/app/
RUN yarn --production && \
    yarn cache clean
COPY ${PROJECT_DIR} /usr/src/app

CMD ["node", "src/index.js"]
