# 1. Base Image
FROM node:20-alpine

# 2. Set Working Directory
WORKDIR /usr/src/app

# 3. Copy Dependency Files
COPY package.json package-lock.json ./

# 4. Install Dependencies
RUN npm ci --only=production

# 5. Copy Application Source Code
COPY src/ ./src/

# 6. Expose Port
EXPOSE 7777

# 7. Start the Application
CMD ["node", "src/app.js"]
