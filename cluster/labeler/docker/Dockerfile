FROM python:3.11-slim

# Install system dependencies and ptouch-print
RUN apt-get update && apt-get install -y \
    cmake \
    gettext \
    git \
    build-essential \
    libusb-1.0-0-dev \
    libgd-dev \
    fonts-dejavu-core \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

# Clone and build ptouch-print
WORKDIR /tmp
RUN git clone https://git.familie-radermacher.ch/linux/ptouch-print.git && \
    cd ptouch-print && \
    ./compile.sh && \
    cp build/ptouch-print /bin/ && \
    cd / && \
    rm -rf /tmp/ptouch-print

# Set up application
WORKDIR /app

# Copy application files
COPY app.py /app/
COPY templates /app/templates/

# Install Python dependencies
RUN pip install --no-cache-dir flask gunicorn

# Create a non-root user (but needs USB device access)
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Expose port
EXPOSE 5000

# Switch to non-root user
USER appuser

# Run with gunicorn for production
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "app:app"]