Notes:

build images:
docker build -t backend -f backend/Dockerfile.dev backend
docker build -t frontend -f frontend/Dockerfile.dev frontend
docker build -t nginx -f nginx/Dockerfile.dev nginx

start postgres & redis:
docker-compose up redis postgres

start backend & frontend:
docker-compose up backend frontend

start nginx:
docker-compose up nginx
