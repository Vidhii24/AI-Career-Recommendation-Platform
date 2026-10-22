FROM node:20-bookworm-slim

# Install Python and essential system packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies in a dedicated virtualenv
COPY ml/requirements.txt ./ml/requirements.txt
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /app/venv/bin/pip install --no-cache-dir -r ml/requirements.txt

# Install Node backend dependencies
COPY package.json ./
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy application code and artifacts
COPY . .

# Environment configuration
ENV PATH="/app/venv/bin:$PATH"
ENV PORT=5000
ENV NODE_ENV=production
ENV ML_SERVICE_URL="http://127.0.0.1:8000"

EXPOSE 5000

# Start FastAPI ML microservice on port 8000, then start Express backend on $PORT
CMD ["sh", "-c", "python3 -m uvicorn ml.app:app --host 127.0.0.1 --port 8000 & node server/server.js"]
