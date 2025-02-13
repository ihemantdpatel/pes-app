FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY .sequelizerc ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY .sequelizerc ./

RUN npm install

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8080
# Run migrations, seed database, then start the server
CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]