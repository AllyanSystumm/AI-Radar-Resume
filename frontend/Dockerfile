# Use official Node 20 slim image
FROM node:20-slim

# Set work directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy application code
COPY . .

# Expose port (Next.js default)
EXPOSE 3000

# Command to run development server
# For production, you'd use: RUN npm run build && CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
