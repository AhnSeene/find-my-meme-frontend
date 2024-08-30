FROM node:14 AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm cache clean --force
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]