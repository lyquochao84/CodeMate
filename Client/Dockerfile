# Use the Node 20 base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port for Next.js
EXPOSE 3000

# Start Next.js app
CMD ["npm", "run", "dev"]