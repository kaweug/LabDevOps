#!/bin/zsh
echo "Staring databases.."
docker-compose -f docker-compose.yml up -d postgres redis
sleep 5
echo "Staring apps.."
docker-compose -f docker-compose.yml up -d backend frontend
sleep 5
echo "Staring nginx.."
docker-compose -f docker-compose.yml up -d nginx
