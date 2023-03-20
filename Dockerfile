FROM node:18-alpine as build

WORKDIR /home/node

COPY . /home/node

RUN \
    npm ci && \
    npm run build

FROM nginx

COPY --from=build /home/node/dist /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html