#    Билд образа:
#    docker build -t frontend-app .
#
#    Запуск образа (на localhost:8080):
#    docker run --name frontend-app -p 8080:80 frontend-app
#
#    Запуск образа как виртуальный хост (инфа: https://github.com/jwilder/nginx-proxy):
#    docker run -e VIRTUAL_HOST=frontend-app.your-domain.com --name frontend-app frontend-app
#
#    Очистка (удаление промежуточных образов):
#    docker rmi -f $(docker images -f "dangling=true" -q)

# Этап 1, берем образ Node.js чтобы собрать наше приложение

FROM node:8.9.4-alpine as builder
LABEL maintainer="ed@netlab.pro"

RUN apk add --no-cache git && \
    npm install -g yarn@0 && \
    yarn global add greenkeeper-lockfile@1

COPY package.json ./
COPY yarn.lock ./

RUN yarn && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN yarn run build:universal-prod

CMD ["yarn", "run", "serve"]
