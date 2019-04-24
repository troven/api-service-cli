API micro-services
------------------

This project is a micro-framework to simplify the creation of sophisticated, policy-driven micro-services based on an annotated OpenAPI specification.

Once configured, requests can be served by either a `Plugin` or an `Operation`.

- An `Operation` is middleware that returns a response. It can be bound to one or more OpenAPI resources.

- A `Plugin` is a strategy - it can be used to serve multiple endpoints - or do something else entirely.

API Endpoints
-----------

Most API endpoints are defined by an OpenAPI specification. The Chassis supports OpenAPI (OAS) v3 only.

The configuration uses OpenAPIv3 to define the endpoints and associated middleware operations.  

The OpenAPI spec defines the resources, methods, operations and the security policies.

No requests are served by default - a working configuration is required. 

The api-service uses a YAML language to describe APIs as configuration file - the OAS definition can be embedded or loaded from a file. 

OpenAPI Configuration
---------------------

In the `openapi` section of the configuration, we need to specify only the minimum necessary to serve requests.

In the common case that means adding the `chassis` declaration to an endpoint:

```
openapi:
  paths:
    /healthz:
      get:
        chassis:
          operationId: api.heartbeat
```

NOTE: Due to the root `openapi` key, the normal values are 1-indent deeper than standard OASv3 YAML.

Configuration
-------------

The Chassis is driven by the configuration (YAML) file that declares the plugins, the OpenAPI spec and policies.

The chassis incorporates non-functional support for 12-factor applications, logging and auditing.

The chassis loads it's configuration from the ./config folder. Configurations can be specified in JSON or YAML.

The implementation uses the [npm config package](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

First, the chassis loads the `default.json/default.yaml` file from the `./config` folder.

Then it merges the config file that relates to the current NODE_ENV (or "development" if unset)

Minimal Configuration
---------------------

Each Chassis must be declared with a name and a port. The simplest configuration would be some YAML like this:

```
    name: Troven-chassis-example
    port: 5005
```

The logging sub-system captures JSON based log messages that follow a lightweight convention. A log is a system / debug level activity.

```
    logging:
      file:
        filename: node-chassis.log
```
The auditor sub-system captures JSON based audit messages that follow a lightweight convention. An audit is a user-driven activity.

```
    auditor:
      enabled: true
      file:
        filename: node-chassis-audit.log
```

Configuring Features
--------------------

The basic Chassis can be upgraded using Feature Plugins.

Feature Plugins are installed and initialized when the Chassis starts.

A suite of default plugins are baked-in, new plugins can be easily developed.

To enable a feature, simply configure it by name:

```
features:
  cors:
    enabled: true
  json:
    enabled: true
  openapi:
    enabled: true
```

NOTE: Each plugin is `enabled` by default.

Endpoint Feature
----------------

The chassis needs to know how to map an incoming request to a functional endpoint.

Each resource/method in the OpenAPI specification can (and should) be assigned an operation.

For example:

```
openapi:
  paths:
    /example:
      get:
        operationId: heartbeat_ignored_by_chassis
        chassis
            operationId: api.heartbeat
            message: hello world
```

The `chassis` options are augmented at runtime with various parameters.

The `chassis.operationId` will be used to lookup the feature - not the method's operationId.

Proxy Endpoint
--------------

The proxy feature will forward requests to a remote target and return the response.

This is used to expose 3rd party endpoints (internal micro-services, cloud providers, etc) as a simple reverse proxy.

```
/proxy/healthz:
  get:
    summary: Health check via proxy
      chassis:
        operationId: api.proxy
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

OpenAPI Security
----------------

The OAS security policies can be enforced.

The root security policy will be used unless the operation specifies a policy.

```
openapi:
  security:
    - jwt: [ "example:api:generic" ]
  info:
  paths:

    /healthz:
      get:
        chassis:
          operationId: api.heartbeat
        security:
        - jwt: [ "example:api:heartbeat" ]
```

The `jwt` scheme must be defined in `components.securitySchemes` like this:

```
components:
  securitySchemes:
    jwt:
      type: http
      scheme: bearer
      description: JWT bearer key to authorize requests.
      bearerFormat: JWT
      name: authorization
      in: header
```

Current only "http" type and "bearer" scheme are supported at runtime.

TODO: support more schemes, for example: `apikey`, `openid` and `oauth2`

Securing Endpoints
------------------

Additional security features are available.

If we want to enforce security before every request, we can do this with the `before` feature.

With `authenticate_jwt`, we assert the JWT is valid and signed by the `certificateFile`.

With `authorize_jwt`, we match claims against the decoded JWT.

```
features:
    before:

        authenticate_jwt:
          client_id: test-lab
          certificateFile: ./local/keycloak-public.pem

        authorize_jwt:
          claims:
            iss: https://login.lab.troven.co/auth/realms/Troven

```

Resolving operationId
---------------------

The OpenAPI "operationId" is not used by the chassis. It must be unique across all resources.

The Chassis uses the operationId in x-chassis options as the name for the IChassisMiddleware.

If no match is found, the chassis will abort with a fatal error.

The plugins are loaded by the `start.js` bootstrap file. 

For a custom plugin / chassis, you can copy code from `api-service-example`.

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

Start Example Service
---------------------

Check out the example:

```
cd api-service
npm link
cd..
cd api-service-example
npm link api-service
npm install
npm start
```

Acquiring a Fake JWT
--------------------

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

