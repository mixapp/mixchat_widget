# Stage 1
FROM node:10.10.0 as widget
WORKDIR /widget
COPY . ./
RUN yarn
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=widget /widget/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]