FROM node:16

WORKDIR /code

COPY package.json ./

RUN npm install

COPY . .

RUN npm install -g @quasar/cli

EXPOSE 9000

CMD [ "quasar", "dev" ]