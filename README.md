# **Coopilot**
A Web Application

You will need [**Docker** and **docker-compose**](https://www.docker.com) to build and run Coopilot using these instructions.

## Getting Coopilot
Clone the repository and submodules

    git clone --recurse-submodules https://github.com/coop-blake/Coopilot.git  

 > The [dojo toolkit](https://dojotoolkit.org) is included as a submodule. If the `--recurse-submodules` 
 > flag is omitted durring cloning or you download the zip file, you can run `git submodule update --init --recursive` in 
 > the root directory to download the dojo toolkit submodules.

## Building and Running Coopilot

_Enter the repository root:_

    cd Coopilot

### Build:
Will take a few minutes to complete

    docker-compose -f ./builds/coopilot/docker-compose.yml build
_This builds the Mongo and SQL database server containers as well as the node.js container that runs Coopilot_

_It also copies the repository to the main container and builds the minified interface files_
### Run:
Start up the Balek containers in the background  

    docker-compose -f ./builds/coopilot/docker-compose.yml up -d
_This starts up the Mongo, SQL, and Node.js containers and runs the Server instance using the source files copied to the container Volume durring the build process_

_There are three local directories in [builds/coopilot](./builds/coopilot) that get mounted in the containers when they are brought up. This allows for the Coopilot configuration and database data to live on the host where it can be retained, copied, and modified_

### Stop:
Stop the Balek containers  

    docker-compose -f ./builds/coopilot/docker-compose.yml down



## Accessing Coopilot  

Once the containers are up and running you can access your Coopilot instance through [https://localhost/](https://localhost/)

To access the built/minified interface you have to request [https://localhost/release/](https://localhost/release/)  

📝 _A release build should be created_



## Configuring Coopilot
The configuration directory for the docker build can be found at [`builds/coopilot/conf`](builds/coopilot/conf)
### SSL certificates
Self signed certificates are auto generated along with a directory to hold them durring the build process

You can place your own ssl certificates in the [`builds/coopilot/conf/cert`](builds/coopilot/conf/cert) directory and restart(Stop/Run) your containers to use them.
### Advanced Configuration
Modify [`builds/coopilot/conf/config.json`](builds/coopilot/conf/config.json) and restart containers.  
See the [`src/balek-server/etc/README.md`](src/balek-server/etc/README.md) for more info.

