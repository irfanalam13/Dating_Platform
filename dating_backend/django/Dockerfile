FROM python:3.11-slim

WORKDIR /app

# Prevent Python from writing .pyc files & enable logs instantly
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

# Install system dependencies (GeoDjango + PostgreSQL)
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# GDAL paths
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Install Python dependencies (cached layer)
COPY requirements.txt .

RUN pip install --upgrade pip --default-timeout=100 --retries=5 && \
    pip install --no-cache-dir --default-timeout=100 --retries=5 -r requirements.txt

# Copy project files
COPY . .

# CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && python manage.py create_admin && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]
