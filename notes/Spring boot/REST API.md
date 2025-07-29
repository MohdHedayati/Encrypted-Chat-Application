## Communication 
* Client -> Server
* Client -> REST API -> Server.
* Client sends  a request -> REST API -> Tomcat Server -> @RestController(which returns data according to the mapping).
* @GetMapping maps the endpoint to a particular function.


# REST API
 1. **RE**presentational **S**tate **T**ransfer  **A**pplication **P**rogramming **I**nterface.
2. REST API (client<--phone call-->server)= URL(where to call) + HTTP  verb(kaam). 
3. Specifically for HTTP request only.
4. HTTP requests 
	- GET : to get data from server.
	- POST : submit data  to server.
	- PUT : replace data on server.
	- DELETE : delete data from server.

## **Connections**

-  localhost:8080 --> @RestController
- localhost:8080/class-name -> @RequestMapping
- localhost:8080/class-name/endpoint -> @GetMapping / @PostMapping

## GET method
-  returns data by finding the endpoint in URL , maps the endpoing to the method returning any type of data (object , list of objects,etc)
## POST method
- saves data sent in the @RequestBody( JSON  --> getters and setters of class )
## PUT method 
- modifies the data ofcourse need different endpoint if any other put method is used.
- use logical name for endpoint to avoid confusion though same endpoint with different request can be accessed.
## *DELETE method
- removes any data requested .
*path variable - extract arguments from URL and pass it to methods for REST CONTROLLER
-using @PathVariable 

*Request Body -  request the body of mentioned class type asking for attributes of that class this is used in PUT and POST method. 





