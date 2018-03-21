FROM fishead/node-jcnetwork:8-alpine

ARG PROJECT_DIR=.
ARG BUILD_DEPS="native-deps git g++ gcc libgcc libstdc++ linux-headers make python"

COPY ${PROJECT_DIR}/package.json /usr/src/app/

# rebuild native module `bcrypt` from source code to fix issue `https://github.com/kelektiv/node.bcrypt.js/issues/528`
RUN apk add --no-cache --virtual ${BUILD_DEPS} && \
    yarn --production && \
    npm rebuild bcrypt --build-from-source && \
    yarn cache clean

COPY ${PROJECT_DIR} /usr/src/app

CMD ["node", "src/index.js"]
