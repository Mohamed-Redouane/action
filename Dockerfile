# ====== FRONTEND STAGE ======
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Inject environment variables for the frontend
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY=${VITE_GOOGLE_MAPS_API_KEY}

COPY frontend ./
RUN npm run build

# ====== BACKEND STAGE ======
FROM node:18-alpine AS backend

WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm install

COPY backend ./

# Copy frontend build output to backend's public folder
COPY --from=frontend-builder /frontend/dist /backend/dist

# Set environment variables (Injected from Railway)
ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV CLIENT_URL=${CLIENT_URL}

# Ensure TypeScript is compiled before running
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
