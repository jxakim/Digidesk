# frontend/Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve build with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html