API services
------------

This project is a micro-framework to simplify the creation of policy-driven micro-services based on an annotated OpenAPI specification.

Installation
------------

```
npm -g api-services-cli
```

Initialize Project
------------------

```
mkdir my-project
a6s init
```

This will create two directories `config` and `oasv3`. 

The `config` folder contains a YAML file that configures the runtime service and global features (plugins). 
It may, optionally, include an initial OpenAPI definition.

The `oasv3` folder also contains an example YAML file that specifies the OpenAPI v3 resources and the features that they represent.

Additional OpenAPI v3 definition resources can be included in this folder.

Start Services
--------------

Once configured (using `a6s init` or manually), then you can start the API Services:

```
a6s start
```

Configuration
-------------

`a6s` reads the configuration (YAML) file to initialize the global features and the default OpenAPI definition.

The command loads it's configuration from the `./config` folder. Configurations can be specified in JSON or YAML. 

The implementation uses the [npm config package](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

By default, the chassis loads the `default.yaml` file from the `./config` folder.

Then it merges the config file that relates to the current NODE_ENV (or "development" if unset)

Minimal Configuration
---------------------

Each Chassis must be declared with a name and a port. The simplest configuration would be some YAML like this:

```
    name: example
    port: 5008
```

Configuring Features
--------------------

Feature plugins are installed and initialized when `a6s` starts.

A useful suite of default plugins are baked-in but new plugins can be developed relatively easily.

To enable a feature, simply configure it using it's registered name:

```
features:
  payload:
    enabled: true
  openapi:
    enabled: true
```

The `openapi` feature is effectively mandatory if OpenAPI definitions are required. 

Configuration from Environment
------------------------------

The injection algorithm is simply: remove the prefix, convert to lower case, convert `_` to `.` then treat the result as a JSON path to update the config.

```
    export APIS_NAME=my-chassis-example
    export APIS_PORT=5005
    export APIS_AUDITOR_ENABLED=true
    export APIS_AUDITOR_FILE_FILENAME=my-chassis.log
```

At runtime, the chassis will deeply inject the following:

```
name: "my-chassis-example"
port: 5005
auditor:
    enabled: true
    file:
      filename: "my-chassis.log"
```

Configuration from external files
---------------------------------

This approach allows a standard OpenAPI specification to be reused but augmented with Chassis specific configuration.

It may be used for other purposes - to promote re-use, readability and resilience to change.

If a key ends with the `@` symbol - then the value will be used to resolve the values from a File or API.

```
"openapi@": "./docs/swagger.yaml"
openapi:
  info:
    summary: "My example API"
```

If a similar key exists - `openapi@` and `openapi` - they are merged.

The remote file from `openapi@` is loaded first, then the contents are deep merged with the `openapi` values.

In this example, the loaded `info.summary` will be replaced with the inline "My example API".

The merged result is stored into the `openapi` field in the runtime config.

At runtime, for example in a plugin - the uplifted specification is available as "context.openapi".

Defining Operations
-------------------

Each resource/method in the OpenAPI specification can (and should) be assigned an operation.

For example:

```
openapi:
  paths:
    /hello_world:
      get:
        feature
          heartbeat:
            message: hello world
```

The `feature` options are augmented at runtime with various parameters, including from the global configuration.

Proxy Feature
--------------

The proxy feature will forward requests to a remote target and return the response.

This is used to expose 3rd party endpoints (internal micro-services, cloud providers, etc) as a simple reverse proxy.

```
/proxy/healthz:
  get:
    summary: Health check via proxy
      feature:
        proxy:
          target: http://localhost:5005/healthz
 ```

Advanced proxy options can be found at [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#http-proxy-options).

Note: the defaults used by the chassis are different from the `http-proxy-middleware` implementation:

 ```
  ignorePath: true
  pathRewrite: true
  changeOrigin: true
  xfwd: true
 ```


Faking a  JWT
-------------

from another terminal, invoke the physical API endpoint:

```
export FAKE_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjdG9AYXBpZ2Vla3MuY29tIiwibmFtZSI6IkFQSTpHZWVrcyIsImlhdCI6MTUxNjIzOTAyMiwicm9sZXMiOlsiZXhhbXBsZTphcGk6Z2VuZXJpYyIsImV4YW1wbGU6YXBpOmhlYWx0aHoiLCJleGFtcGxlOmFwaTpzd2FnZ2VyIl19.Xx9hFMLLTCWplmfeQHEkaUUlZTmQ_0dSk0fsxRikNRg"

curl http://localhost:5005/healthz -H "authorization: Bearer $FAKE_JWT"

curl http://localhost:5005/swagger -H "authorization: Bearer $FAKE_JWT"
```

To create your own synthetic JWT, see [https://jwt.io](https://jwt.io) and paste a JWT payload something like this:

```
{
  "sub": "cto@example.com",
  "name": "Local:Example",
  "iat": 1516239022,
  "roles": [ "example:api:heartbeat" ]
}
```

The `roles` field is critical. Roles are used to validate against the scopes from the configured Open API specification.
