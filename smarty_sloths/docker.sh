#!/bin/bash
# docker build -t smarty_sloths:latest .
docker build -t gcr.io/mcc-2016-g17-p2/smarty_sloths:latest .
gcloud docker -- push gcr.io/mcc-2016-g17-p2/smarty_sloths:latest
