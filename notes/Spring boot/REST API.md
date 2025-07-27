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


