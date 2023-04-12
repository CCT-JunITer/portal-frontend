FROM node:latest as builder
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install --progress=false

COPY . src/ public/ modules/ /app/

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
