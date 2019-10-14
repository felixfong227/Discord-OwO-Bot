FROM ubuntu

WORKDIR /app

COPY ./package.json /app
COPY ./Docker/scripts /var/setup/scripts

RUN cat /var/setup/scripts/mysql/pwd.sh && \
    apt-get update && \
    apt-get install curl --yes && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install nodejs git --yes

RUN npm install yarn -g

RUN yarn install --production

COPY . /app

COPY ./json/example_secret_files /tokens

RUN node ./bin/JSON5_To_JSON.js /tokens/owo-login.json self

RUN node /app/index.js

EXPOSE 3001