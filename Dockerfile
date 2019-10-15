FROM ubuntu

WORKDIR /app

COPY ./package.json /app
COPY ./Docker/scripts /var/setup/scripts

ENV BOT_TOKEN=${DISCORD_OWO_TOKEN}
ENV ADMIN_USERNAME=${DISCORD_OWO_ADMIN}
ENV MYSQL_USERNAME="root"
ENV MYSQL_PASSWORD="root"
ENV NODE_ENV="production"

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

RUN node ./bin/pwd.js /tokens/owo-auth.json /tokens/owo-login.json

RUN node /app/index.js

EXPOSE 3001