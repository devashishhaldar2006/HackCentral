
# STAGE 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files and install
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Build the Vite project (outputs static files to /dist)
RUN npm run build

# STAGE 2: Serve with Nginx

FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React files from Stage 1 (builder)
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
