FROM node:18-bullseye
RUN mkdir /app
WORKDIR /app
ADD . /app/
RUN yarn
RUN yarn build
ENV HOST 0.0.0.0
ENV API_URL http://localhost:8000/
ENTRYPOINT yarn start
