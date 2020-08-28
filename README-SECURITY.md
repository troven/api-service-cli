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
    authenticate_jwt:
      client_id: test-lab
      certificateFile: ./local/keycloak-public.pem

    authorize_jwt:
      claims:
        iss: https://oauth.pro/auth/realms/example

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
  "iss": "https://oauth.pro/auth/realms/example",
  "iat": 1516239022
}
```
