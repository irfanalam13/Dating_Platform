FROM postgis/postgis:15-3.4

RUN apt-get update && apt-get install -y \
    postgresql-server-dev-15 \
    build-essential \
    clang-13 \
    git \
    && git clone https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install \
    && cd .. \
    && rm -rf pgvector \
    && apt-get remove -y build-essential git clang-13 \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
    