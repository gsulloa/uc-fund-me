FROM node:9.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .


# Start application
EXPOSE 8080
CMD ["npm", "start"]
