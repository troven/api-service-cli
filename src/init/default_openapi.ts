export default (name: string) => {
  console.log("copying OpenAPI definition: %s", name);

  return {
    apiVersion: "k8s.a6s.dev/v1",
    kind: "OpenAPI",
    metadata: {
      name: name,
    },
    spec: {
      tags: [
        {
          name: "health",
          description: "Health Checks",
        },
        {
          name: "catalog",
          description: "API Catalog",
        },
      ],
      paths: {
        "/ui": {
          get: {
            summary: "UI Definition",
            feature: {
              "ui.config": {
                enable: true,
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {},
                },
              },
            },
          },
        },
        "/healthz": {
          get: {
            summary: "Health check",
            tags: ["health"],
            feature: {
              heartbeat: {
                enabled: true,
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {
                    schema: {
                      $ref: " /components/schemas/healthz",
                    },
                  },
                },
              },
            },
          },
        },
        "/example/debug": {
          get: {
            operationId: "debug.get",
            summary: "Debug API",
            tags: ["debug"],
            feature: {
              debug: {
                body: true,
                echo: true,
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {},
                },
              },
            },
          },
          post: {
            operationId: "debug.post",
            summary: "Debug API",
            tags: ["debug"],
            feature: {
              debug: {
                body: true,
                echo: true,
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {},
                },
              },
            },
          },
        },
        "/proxy/*": {
          get: {
            operationId: "proxy.get",
            summary: "Via (Wildcard proxy)",
            tags: ["proxy"],
            feature: {
              proxy: {
                reuseJWT: false,
                logLevel: "debug",
                toProxy: false,
                prependPath: false,
                ignorePath: false,
                secure: false,
                target: "http://localhost:5008",
                secretEnvKey: "NODE_ENV",
                secretHeader: "x-injected-node-env",
                secretHeaderType: "raw",
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {},
                },
              },
            },
          },
          post: {
            operationId: "proxy.post",
            summary: "Via (Wildcard proxy)",
            tags: ["proxy"],
            feature: {
              proxy: {
                reuseJWT: false,
                logLevel: "debug",
                toProxy: false,
                prependPath: false,
                ignorePath: false,
                secure: false,
                target: "http://localhost:5008",
                secretEnvKey: "NODE_ENV",
                secretHeader: "x-node-env",
                secretHeaderType: "raw",
              },
            },
            responses: {
              "200": {
                description: "200 response",
                content: {
                  "application/json": {},
                },
              },
            },
          },
        },
      },
      "/models/{collection}/": {
        get: {
          parameters: [
            {
              in: "path",
              name: "collection",
              schema: {
                type: "string",
              },
              required: true,
              description: "type of models",
            },
          ],
          feature: {
            jwt: {
              claims: {
                "$.realm_access.roles": ["a6s:default:role"],
              },
            },
            localdb: {
              collection: '{{collection}}',
              enabled: true,
            },
          },
        },
        post: {
          parameters: [
            {
              in: "path",
              name: "collection",
              schema: {
                type: "string",
              },
              required: true,
              description: "type of models",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: " /components/schemas/model",
                },
              },
            },
          },
          feature: {
            jwt: {
              claims: {
                "$.realm_access.roles": ["a6s:default:role"],
              },
            },
            localdb: {
              collection: '{{collection}}',
              enabled: true,
            },
          },
        },
      },
      "/models/{collection}/{_id}": {
        get: {
          parameters: [
            {
              in: "path",
              name: "collection",
              schema: {
                type: "string",
              },
              required: true,
              description: "type of models",
            },
            {
              in: "path",
              name: "_id",
              schema: {
                type: "string",
              },
              required: true,
              description: "ID used to identify model",
            },
          ],
          feature: {
            jwt: {
              claims: {
                "$.realm_access.roles": ["a6s:default:role"],
              },
            },
            localdb: {
              collection: '{{collection}}',
              enabled: true,
              filterBy: ["_id"],
            },
          },
        },
        put: {
          parameters: [
            {
              in: "path",
              name: "collection",
              schema: {
                type: "string",
              },
              required: true,
              description: "type of models",
            },
            {
              in: "path",
              name: "_id",
              schema: {
                type: "string",
              },
              required: true,
              description: "ID used to identify model",
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: " /components/schemas/model",
                },
              },
            },
          },
          feature: {
            jwt: {
              claims: {
                "$.realm_access.roles": ["a6s:default:role"],
              },
            },
            localdb: {
              collection: '{{collection}}',
              enabled: true,
            },
          },
        },
        delete: {
          parameters: [
            {
              in: "path",
              name: "collection",
              schema: {
                type: "string",
              },
              required: true,
              description: "type of models",
            },
            {
              in: "path",
              name: "_id",
              schema: {
                type: "string",
              },
              required: true,
              description: "ID used to identify model",
            },
          ],
          feature: {
            jwt: {
              claims: {
                "$.realm_access.roles": ["a6s:default:role"],
              },
            },
            localdb: {
              collection: '{{collection}}',
              enabled: true,
            },
          },
        },
      },
    },
    components: {
      schemas: {
        healthz: {
          type: "object",
          properties: {
            ok: {
              type: "string",
            },
          },
        },
        model: {
          type: "object",
          additionalProperties: false,
          required: ["title"],
          properties: {
            title: {
              type: "string",
            },
          },
        },
      },
    },
  };
};
