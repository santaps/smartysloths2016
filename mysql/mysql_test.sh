#!/bin/bash
gcloud container clusters create mysql --num-nodes 3
gcloud compute disks create --size 200GB mysql-disk-1
gcloud compute disks create --size 200GB mysql-disk-2
kubectl create -f mysql-master-rc.yaml
kubectl create -f mysql-slave-rc.yaml
kubectl create -f mysql-master-svc.yaml
kubectl create -f mysql-slave-svc.yaml
