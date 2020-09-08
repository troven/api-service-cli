export default (name: string) => {
  console.log("copying config: %s", name);

  return {
    "name": name,
    "port": 5008,
    "auditor": {
      "enabled": true,
      "File": {
        "filename": name+".log"
      }
    },
    "logging": {
      "enabled": true,
      "Console": {
        "enabled": true
      }
    },
    "features": {
      "logging": { enabled: true},
      "payload": {
        "enabled": true
      },
      "cors": {
        "enabled": true
      },
      "prometheus": {
        "enabled": true
      },
      "jwt": {
        "secret": false
      },
      "pipeline": {

      },
      "openapi": {
        "enabled": true,

      },
      "controller": {
        "enabled": true,
        "crd": false,
        "folder": "./oasv3/"
      },
      "localdb": {
        "database": "example"
      }
    },
    "openapi": {
      "servers": [
        {
          "url": "https://api.example.a6s.dev/"
        }
      ],
      "info": {
        "title": "Controller OpenAPI for "+name
      },
      "paths": {
        "/": {
          "get": {
            "summary": "Open API docs",
            "feature": {
              "apidocs": {
                "enable": true
              }
            },
            "responses": {
              "200": {
                "description": "200 response",
                "content": {
                  "application/json": {
                  }
                }
              }
            }
          }
        },
        "/datadict": {
          "get": {
            "summary": "Open API docs",
            "feature": {
              "datadict": {
                "enable": true
              }
            },
            "responses": {
              "200": {
                "description": "200 response",
                "content": {
                  "application/json": {
                  }
                }
              }
            }
          }
        },
        "/healthz": {
          "get": {
            "summary": "Health check",
            "feature": {
              "heartbeat": {
                "enabled": true
              }
            },
            "responses": {
              "200": {
                "description": "200 response",
                "content": {
                  "application/json": {
                    "schema": {
                      "$ref": "#/components/schemas/healthz"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "components": {
        "schemas": {
          "healthz": {
            "type": "object",
            "properties": {
              "ok": {
                "type": "string"
              }
            }
          }
        },
        "securitySchemes": {
          "oauth2_jwt": {
            "type": "http",
            "scheme": "bearer",
            "description": "JWT bearer key to authorize requests.",
            "bearerFormat": "JWT"
          }
        }
      }
    }
  }
}
