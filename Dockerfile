FROM node:10.16.3

ARG BOT_TOKEN
ARG ADMIN_USERNAME
ARG NODE_ENV
ARG MYSQL_USERNAME
ARG MYSQL_PASSWORD

ENV BOT_TOKEN=${BOT_TOKEN}
ENV ADMIN_USERNAME=${ADMIN_USERNAME}
ENV MYSQL_USERNAME=${ADMIN_USERNAME}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY ./package.json /app

RUN npm install yarn -g && \
    yarn install --production

COPY . /app
COPY ./json/example_secret_files /tokens

RUN node ./bin/JSON5_To_JSON.js /tokens/owo-login.json self && \
    node ./bin/pwd.js /tokens/owo-auth.json /tokens/owo-login.json

CMD [ "node", "index.js" ]

EXPOSE 3001