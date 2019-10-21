FROM node:10

# Create app directory
WORKDIR /usr/src/app
#install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3003

CMD ["npm", "start"]
