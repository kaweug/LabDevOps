kubectl create namespace cube

kubectl apply -f secret.yml
kubectl apply -f config.yml
kubectl apply -f pvc-definition.yml

kubectl get secret,pvc,configmap --namespace cube

kubectl apply -f postgres-deployment.yml && kubectl apply -f postgres-service.yml

kubectl get deployment -o wide postgres-deployment --namespace cube
kubectl get service postgres-service --namespace cube
kubectl describe svc postgres-service --namespace cube

kubectl apply -f redis-deployment.yml && kubectl apply -f redis-service.yml

kubectl get all -o wide --namespace cube

kubectl apply -f backend-deployment.yml && kubectl apply -f backend-service.yml

kubectl apply -f backend-debug.yml
kubectl delete svc backend-debug --namespace cube


##Cleanup disk - postgres
kubectl delete deployment backend-deployment --namespace cube
kubectl delete deployment postgres-deployment --namespace cube
kubectl delete pvc postgres-pvc --namespace cube


kubectl apply -f frontend-deployment.yml && kubectl apply -f frontend-service.yml

kubectl apply -f ingress.yml

total cleanup: kubectl delete all --all --namespace cube
