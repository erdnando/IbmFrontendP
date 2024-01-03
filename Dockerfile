FROM --platform=linux/amd64 node:18.10.0-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
FROM nginx:stable-alpine



RUN rm -v /usr/share/nginx/html/index.html
COPY --from=build /app/dist/ibm.hours /usr/share/nginx/html

#RUN rm -rf /etc/nginx/nginx.conf
#COPY nginx.conf /etc/nginx/



RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 80    

CMD ["nginx", "-g", "daemon off;"]