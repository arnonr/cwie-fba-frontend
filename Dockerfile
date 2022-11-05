#base image
FROM node:16.15-alpine

#set working directory
WORKDIR /app

#add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

#install and cache app dependencies
COPY package.json ./
# RUN npm install
RUN npm install -g npm@8.19.2

COPY . .

# RUN npm run build

RUN chown -R node /app
USER node

#start appCMD [ "http-server", "dist" ]
CMD ["npm", "run", "serve"]

EXPOSE 8080