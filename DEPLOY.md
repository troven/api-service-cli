Pipeline
--------

Configuration
-------------
    export NEXUS_USERNAME=apigeeks
    export NEXUS_PASSWORD=change-me

Optionally:
    # export NEXUS_HOST=nexus.lab.apigeeks.com
    # export K8S_NAME=apigeeks-lab

To publish NPM and Docker images

    ./bin/build-npm.sh
    ./bin/build-docker.sh

To deploy via Helm

    ./bin/deploy-service.sh

TODO: add side-car configuration to Helm

Example
-------

the home page uses a static_asset policy (i.e. files injected via sidecar)

	https://node-chassis-service.lab.apigeeks.com/

this uses a "side-car” plugin (local)

	https://node-chassis-service.lab.apigeeks.com/example1

this uses a bulit-in policy

	https://node-chassis-service.lab.apigeeks.com/heartbeat

this has a JWT policy (401 Unauthorized)

	https://node-chassis-service.lab.apigeeks.com/example2

