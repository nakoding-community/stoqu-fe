# # build environment
FROM node:14.17.1-alpine as build
ARG REACT_APP_ENV
ARG REACT_APP_BASE_URL
ARG REACT_APP_TIME_OUT
ARG REACT_APP_VERSION
ARG PUBLIC_URL
ENV REACT_APP_ENV ${REACT_APP_ENV}
ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}
ENV REACT_APP_TIME_OUT ${REACT_APP_TIME_OUT}
ENV REACT_APP_VERSION ${REACT_APP_VERSION}
ENV PUBLIC_URL ${PUBLIC_URL}
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN npm install
RUN npm run build

# production environment
FROM nginx:alpine
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]