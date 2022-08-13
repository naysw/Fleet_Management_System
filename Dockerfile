FROM node:16-alpine AS deps

WORKDIR /app
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock ./
COPY prisma ./prisma
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# USER node
# COPY --chown=node:node . .
ENV NODE_ENV production
ENV PORT=80
EXPOSE 80

CMD [ "yarn", "start:docker" ]
