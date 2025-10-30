# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Flask backend with frontend
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy backend code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/build /app/static

# Update Flask app to serve static files
# The static folder will contain the built React app

# Expose port (Cloud Run will set PORT env var)
ENV PORT=8080
EXPOSE 8080

# Use gunicorn for production
# --bind 0.0.0.0:$PORT listens on Cloud Run's assigned port
# --workers 2 creates 2 worker processes
# --timeout 0 disables timeout for long-running requests
CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 --timeout 0 run:app
