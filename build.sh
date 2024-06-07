#!/bin/bash

# configure gcloud auth
gcloud auth activate-service-account REDACTED.gserviceaccount.com --key-file secret/mcc-2016-g17-p2-81aab40e2d64.json --project mcc-2016-g17-p2

gcloud config set compute/zone europe-west1-d

# build and push images to google cloud 
echo Building docker images
(
echo django building subshell
cd smarty_sloths
./docker.sh
)

(
echo mysql building subshell
cd  mysql/image/master
./docker.sh

cd ../slave
./docker.sh
)

gcloud container clusters create sloths-cluster --num-nodes 3
gcloud compute disks create --size 200GB mysql-disk-1
gcloud compute disks create --size 200GB mysql-disk-2

gcloud container clusters get-credentials sloths-cluster

kubectl create -f mysql/mysql-master-rc.yaml
kubectl create -f mysql/mysql-slave-rc.yaml
kubectl create -f mysql/mysql-master-svc.yaml
kubectl create -f mysql/mysql-slave-svc.yaml

POD=$(kubectl get pods  -o jsonpath='{.items[0].metadata.name}')

for (( ; ;  ))
do
    PHASE=$(kubectl get pod $POD -o jsonpath='{.status.phase}')
    if [ "$PHASE" = "Running" ]; then
	echo "start creating web server"
	break
    else
	echo "$POD is $PHASE, sleep 5 sec."
	sleep 5
    fi;
done

kubectl create -f smarty_sloths/django-rc.yaml
kubectl create -f smarty_sloths/django-svc.yaml
