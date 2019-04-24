Pipeline
--------

Configuration
-------------
    export NEXUS_USERNAME=Troven
    export NEXUS_PASSWORD=change-me

Optionally:
    # export NEXUS_HOST=nexus.lab.troven.co
    # export K8S_NAME=Troven-lab

To publish NPM and Docker images

    ./bin/build-npm.sh
    ./bin/build-docker.sh

To deploy via Helm

    ./bin/deploy-service.sh

TODO: add side-car configuration to Helm

Example
-------

the home page uses a static_asset policy (i.e. files injected via sidecar)

	https://node-chassis-service.lab.troven.co/

this uses a "side-car” plugin (local)

	https://node-chassis-service.lab.troven.co/example1

this uses a bulit-in policy

	https://node-chassis-service.lab.troven.co/heartbeat

this has a JWT policy (401 Unauthorized)

	https://node-chassis-service.lab.troven.co/example2

