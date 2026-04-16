# 🚀 Project Setup (Docker - One Command)

## 1. Clone project

git clone <your-repo-url>
cd your-project

## 2. Setup environment

cp .env.example .env

## 3. Run project

docker-compose up --build

## 4. Open in browser

Frontend: http://localhost:3000
Backend: http://127.0.0.1:8000

## ⚠️ Notes

* First run may take a few minutes
* Make sure Docker is installed
* If port error occurs: run `docker-compose down`
