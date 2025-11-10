FROM node:20-alpine AS builder
# Copy the entire repository into /app so the frontend generator can read backend/config/config.json
WORKDIR /app
COPY . /app

# Switch into the frontend folder for install/build
WORKDIR /app/frontend

# ensure devDependencies are installed in build stage
ENV NODE_ENV=development

# Use npm install here for consistent node_modules layout inside the container.
# Yarn v4 PnP layouts can cause resolution issues inside minimal build images.
RUN npm install --include=dev --legacy-peer-deps

# build using npm (the frontend package.json runs the generate-config script before build)
RUN npm run build

FROM nginx:alpine AS runner
# Copy the built frontend dist from the builder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
