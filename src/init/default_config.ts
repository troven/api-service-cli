export default () => {
  console.log("copying config");

  return {
    "name": "a6s-default",
    "port": 5008,
    "auditor": {
      "enabled": true,
      "File": {
        "filename": "api-controller.audit.log"
      }
    },
    "logging": {
      "enabled": true,
      "Console": {
        "enabled": true
      }
    },
    "features": {
      "logging": null,
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
        "before": null,
        "after": null
      },
      "openapi": {
        "enabled": true,
        "before": null,
        "after": null
      },
      "controller": {
        "enabled": true,
        "crd": false,
        "folder": "./k8s/"
      },
      "mongodb": {
        "host": "localhost",
        "port": 27017,
        "database": "example",
        "ssl": false
      }
    },
    "openapi": {
      "servers": [
        {
          "url": "https://api.example.a6s.dev/"
        }
      ],
      "info": {
        "title": "Controller OpenAPI"
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
        },
        "/health": {
          "get": {
            "summary": "Health check",
            "feature": {
              "jwt": {
                "claims": "-$.resource_access.account.roles = [ \"api:health\" ]"
              },
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
                      "type": "object",
                      "properties": {
                        "ok": {
                          "type": "string"
                        }
                      }
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
