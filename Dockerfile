# Use official Node.js image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy the source files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript code
RUN npm run build

# ---- Production Image ----
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Only copy necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"]
