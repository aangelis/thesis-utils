FROM node:16-alpine AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY .env .env.production ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:16-alpine AS runner

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD [ "npm", "start" ]