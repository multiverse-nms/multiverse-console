# build stage
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm cache verify
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
COPY ./docker/cert/mnms.gui.crt.pem /etc/nginx/certs/mnms.gui.crt.pem
COPY ./docker/cert/mnms.gui.key.pem /etc/nginx/certs/mnms.gui.key.pem

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
