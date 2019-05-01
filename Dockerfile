FROM node:alpine

LABEL name="api-service-main"
LABEL title="Docker: API MicroMesh"
LABEL author="cto@troven.co"

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package.json .
COPY tsconfig.json .
#COPY .npmrc .
RUN npm install

# RUN npm install --global bower
# COPY bower.json bower.json
# RUN echo '{ "allow_root": true }' > /root/.bowerrc
# RUN bower install --allow-root

# Add our source files
COPY config config
COPY src src
# COPY public public
# COPY views views

EXPOSE 5000

# Launch NodeJS
CMD ["npm", "start"]


