# Old Project reuploaded
Will not run as is, some parts have been hidden or removed

# Prequisites
- [gcloud](https://cloud.google.com/sdk/gcloud/)
- [gcloud kubectl component](https://cloud.google.com/sdk/docs/managing-components)
- [docker](https://docs.docker.com/engine/installation/)

# Files and folders
1. mysql
   -  Dockerfiles and kubernel .yaml files for building mysql containers with slave and master mode.
    
2. secret 
   - gcloud authentication .json file.
	
3. smarty_sloths 
   - Django project, necessary Dockerfiles and kuberctl .yaml files for building Django containers. 

# Build and run the project
1. Run `source ./set_env_vars.sh`
2. Run `./build.sh`
3. Run `kubectl get svc`

# Web
- default port:8000

- username: mcc2016

- password: mcc2016

- username: user1

- password: user1

- username: user2
- password: user2
