FROM swaggerapi/swagger-ui
LABEL maintainer=zhangchuan@jcble.com

ARG PROJECT_DIR=.

ENV SWAGGER_JSON /app/swagger.yaml

COPY ${PROJECT_DIR}/src/swagger.yaml /app/swagger.yaml
