# Production stage
FROM node:20

WORKDIR /app

COPY src/package*.json ./
COPY src/server.js ./
COPY src/index.html ./

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    fonts-noto-color-emoji \
    chromium && \
    npm i && \
    npx puppeteer browsers install && \
    groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g 1001 -s /bin/bash nodejs && \
    mkdir -p /home/nodejs/.cache/puppeteer

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]
