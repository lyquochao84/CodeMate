# Use the Node 20 base image
FROM node:20

# Install nodemon globally
RUN npm install --global nodemon

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port for Express.js server
EXPOSE 5000

# Start Express.js server (modify if needed)
CMD ["npm", "run", "dev"]