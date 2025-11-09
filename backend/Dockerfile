FROM node:20-alpine AS builder
WORKDIR /app

# copy full context (dockerignore excludes node_modules/dist)
COPY . ./

# ensure devDependencies (tsc etc.) are installed in builder
ENV NODE_ENV=development

# install dependencies using Yarn via corepack to match repository packageManager
# fall back to npm if corepack/yarn aren't available
RUN corepack enable && corepack prepare yarn@stable --activate && yarn install || npm install --include=dev

# build: prefer yarn, fallback to npm. If tsc isn't available via installed deps, run it via yarn dlx (temporary)
RUN yarn build || yarn dlx typescript tsc -p tsconfig.json || npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# copy built artifacts and node_modules from builder to keep runner lean
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# copy any backend config (if present) - builder context already includes backend/ files
# Ensure the config folder is available at runtime
COPY --from=builder /app/config ./config

# Install only production/runtime dependencies in the runner to keep the image small
# Prisma Studio / dev tools should run in the separate `prisma` service during development
RUN npm install --only=production

EXPOSE 3000
CMD ["node", "dist/index.js"]
