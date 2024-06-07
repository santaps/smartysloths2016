#!/bin/bash
gcloud -q container clusters delete mysql
gcloud -q compute disks delete mysql-disk-1
gcloud -q compute disks delete mysql-disk-2
