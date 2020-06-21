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

docker-compose -f docker-compose-dev.yml down


Kubernetes:

samples:

kubectl replace -f rs-template.yml

kubectl scale --replicas=3 -f rs-template.yml

kubectl scale --replicas=3 replicaset rs-name

kubectl get {pods, rs, deployments}

kubectl describe {pod, rs, deployment} <<name>>

kubectl delete pod <<pod_name>>

kubectl get all

nginx test deployment steps:

kubectl create namespace cube

kubectl apply --namespace=cube -f nginx_app.yml

kubectl apply -f nodeport.yml

kubectl get all --namespace cube

kubectl delete all --all -n cube

UUID APP deployment steps:

kubectl create namespace cube

kubectl apply --namespace=cube -f uuid_app.yml

kubectl apply -f nodeport.yml  LUB kubectl apply -f clusterip.yml

kubectl apply -f redis_app.yml

kubectl apply -f redis_service.yml

kubectl apply -f dnsutils.yml

IF INGRESS: kubectl apply -f ingress.yml

USE: http://localhost/api (ingress) lub http://localhost:30005 (nodeport)

kubectl exec --namespace cube -ti dnsutils -- nslookup kubernetes.default

kubectl exec --namespace cube -ti dnsutils -- nslookup uuid-app-service

kubectl exec --namespace cube -ti dnsutils -- nslookup redis-service

kubectl get all --namespace cube

kubectl delete all --all -n cube
