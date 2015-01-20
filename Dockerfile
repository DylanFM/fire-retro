FROM node:latest

# Install Phantom JS
RUN npm install -g phantomjs

ADD . /app
WORKDIR /app
