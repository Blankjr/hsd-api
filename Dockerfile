FROM node:16-alpine

WORKDIR /rest

ADD package.json /rest/package.json

RUN npm install

ADD . /rest

EXPOSE 3000

CMD ["npm", "run", "start"]
