# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies including development dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "dist/server.js"]
