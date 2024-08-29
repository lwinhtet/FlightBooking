# Use the official Node.js image as the base image
FROM node:18

RUN npm install --global nodemon

# Set the working directory inside the container
WORKDIR /backend

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

COPY prisma ./prisma/

# Copy the rest of the application code to the container
COPY . .

# Run Prisma migrations and seed the database

RUN npx prisma generate
# RUN npx prisma migrate deploy
# RUN npx prisma db seed -- --count 50
# RUN npm run prisma-migrate-dev
# RUN npm run prisma-seed

# Expose the port the app runs on
EXPOSE 8000

CMD ["npm", "start"]
