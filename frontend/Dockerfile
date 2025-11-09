FROM node:20-alpine AS builder
WORKDIR /app

# copy full context (dockerignore excludes node_modules/dist)
COPY . ./

# ensure devDependencies are installed in build stage
ENV NODE_ENV=development

# install dependencies using Yarn via corepack to match repository packageManager
# fall back to npm if corepack/yarn aren't available
RUN corepack enable && corepack prepare yarn@stable --activate && yarn install || npm install --include=dev

# build: prefer yarn (works with Yarn v4 PnP/install layout), fallback to npm
RUN yarn build || npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
