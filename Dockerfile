FROM node:9.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn

# Bundle app source
COPY . .


# Start application
EXPOSE 3000
CMD ["yarn", "start"]
