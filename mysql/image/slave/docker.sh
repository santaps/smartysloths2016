#!/bin/bash
docker build -t gcr.io/mcc-2016-g17-p2/mysql-slave:latest .
gcloud docker -- push gcr.io/mcc-2016-g17-p2/mysql-slave:latest
