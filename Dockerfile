# build stage
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN rm -rf package-lock.json node_modules/\@ndn
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

# app content
COPY --from=build-stage /app/dist /usr/share/nginx/html

# config file
COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

# certs
COPY ./docker/cert/multiverse.console.crt.pem /etc/nginx/certs/multiverse.console.crt.pem
COPY ./docker/cert/multiverse.console.key.pem /etc/nginx/certs/multiverse.console.key.pem

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
