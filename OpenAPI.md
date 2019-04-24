OpenAPI specification
---------------------

The OpenAPI Specification (nee Swagger Specification), is machine-readable file that describes RESTful web services. 

Tools can read the specification and automatically generate code, documentation and test cases.

A good specification includes request / responses samples, schema, security requirements, etc.

The process of “specification <-> development <-> documentation <-> implementation” can be streamlined. 

Our goal, with standardization and automation, is to do them all them at once.

Endpoints
---------

In the simplest case, resources are "things" we care about - let's work on our "products". 

Typically, an API will have a number of endpoints grouped under the same resource. 

For example, our "products" resource has various endpoints that are also described:

```
POST /products
GET /products
GET /products/{product_id}
PATCH /products/{product_id}
DELETE /products/{product_id}
```

In our case, we described both the general resource and the individual endpoints.

We might want to extend our resources with qualifiers or actions:

```
POST /products/{product_id}/launch
POST /products/{product_id}/discontinue
POST /products/{product_id}/sale
```

Describing Resources
--------------------

Resource descriptions (as well as endpoint descriptions) are typically short, usually 1-3 sentences. What if you have a lot more detail to add? In these situations, keep in mind the difference between reference documentation and user guides/tutorials:

An resource summary should be concise, bare-bones information that developers can quickly comprehend.

Despite vague terminology, generally an API has various “resources” that you access through “endpoints.” 

The “things” that you access using a URL can be referred to in a variety of ways, but “resource” is the most common term because you access them through a URL, or uniform resource locator. 

The endpoints give you access to the resource. (But terminology isn’t standard, so expect variety.)

Other than “resources,” you might see terms such as API calls, endpoints, API methods, calls, objects, services, and requests. It's confusing. 

Describing Methods
-------------------

The endpoints indicate how you access the resource, while the method indicates the allowed interactions (such as GET, POST, or DELETE) with the resource. 

The combination of resource and method is called an "operation" in the Open API specification.

Endpoints usually have brief descriptions similar to the overall resource description but shorter. 

The operation  is arguably the most important aspect of API documentation because this is what developers will implement to make their requests.

Operations are unique across the entire specification, for example

```
Endpoint                                Operation
--------                                ---------
POST /products                          products_create
GET /products                           products_index
```

## Path Parameters

When we need extra qualifiers in our endpoint, we represent them as path parameters and mark them with curly {} braces.

```
Endpoint                                Operation
--------                                ---------
GET /products/{product_id}              products_read
PATCH /products/{product_id}            products_update
DELETE /products/{product_id}           products_delete
```

Curly braces for path parameters are a convention that developers understand. 

In the above example, the {product_id} is an obvious placeholder.


Further Reading
---------------

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md

https://idratherbewriting.com/learnapidoc
