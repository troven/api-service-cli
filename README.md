api-service:
---------------

The Chassis is a micro-framework for implementing simple, policy-driven micro-services based on OpenAPI specification.

The dynamic runtime is based on a flexible, declarative, configuration "language".

No requests are served by default - some configuration is required.

Requests can be served by either a Plugin or an Operation.

- An Operation is middleware that returns a response. It can be bound to one or more OpenAPI resources as an operation.

- A Plugin is a singleton - it can bind to multiple endpoints - or do something else entirely.

The internal API is based on Express and supports standard Connect middleware.

IChassisFeature
---------------

The base interface for Features - Plugins and Middleware.

Only used as sub-class for the Registry.

IChassisPlugin
--------------

All plugins are installed immediately after the Chassis boots() but before it starts().

An IChassisPlugin receives the IChassisContext instance and it's own options.

A IChassisContext may bind to Express or the Event bus or something else entirely.

IChassisMiddleware
------------------

The IChassisMiddleware uses a factory pattern to instantiate Express/Connect middleware .

Each IChassisMiddleware is initialized with an IChassisContext and it's own options.

The purpose of IChassisMiddleware is to returns an Express/Connect middleware with the typical (req,res, next) signature.

The OpenAPI plugin parses the specification and uses the chassis.operationId to inject the feature:

    chassis:
        operationId: my-plugin-name
        option_a: true
        option_b: 42

IChassisContext
---------------

The context object contains essential system bindings.

    context.api         the Express engine - use to bind routes in IChassisPlugin.
    context.bus         the internal EventEmitter. Can be bound to external events. see AMQP plugin.
    context.log         writes to log via the Winston "logger".
    context.audit       writes to audit log via the Winston "auditor".
    context.openapi     bound when "openapi" plugin successfully installs.
