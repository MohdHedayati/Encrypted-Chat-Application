*Used to Secure and Customise authorisation of endpoints.
By default secures all endpoints using an auto-generated password printed in the console(As soon as you add it as a  dependency )

### What Spring Security Customises:
- Login and Password authentication
- Authorisation to Particular Endpoints.
- Method level security.


***Till now what was happening : 
Whenever client(postman) sends a request spring boot was only checking it the URL is available ? No validating of an authorised user when we use the basic authorisation, Username along with password is sent in Header(meta-data) to the spring which then validates and provide access this AUTHORISATION IS STATELESS  (send name and pass with every single request --> tedious)  

@EnableWebSecurity  let customize the authorization process

##### **1. Authentication 
-  Telling who is this and giving a proof 
##### **1. Authorisation
- Can  u do what u want to do