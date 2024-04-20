FROM node:alpine
 
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the entire project
COPY . .
# Copy assets folder

# Build the project
RUN yarn build

# Expose port 80
EXPOSE 3000

# Command to run the application
CMD ["yarn", "preview"]
