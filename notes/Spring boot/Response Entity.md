-  Response from the server saying "Hey , got the data!" , "Data is missing" , "Not expected data" ,etc.
- Always from the server , client always ASKS(request) --> server always RESPONDS.
### Status codes
1.  1xx : receiving request properly,continue
2.  2xx
	**a. 200 : successful GET output**
	b. 201 : successful POST 
	c. 204 : successful GET but data not found
3. 3xx : Redirect somewhere else 
	a. 301 : permanent move of data
	b. 302 :  temporary move of data
	c. 304 : 
4. 4xx (ERROR client side)
	**a. 400 : Bad request 
	b. 402 : Unauthorised 
	c. 403 : Not permitted 
	d. 404 : Not found
5. 5xx (ERROR server side)
	a. 500 : server's internal issue
	b. 502 : proxy (intermediary) received an invalid response
	**c. 503 : server unavailable

*Response entity --> implements status code in spring boot application --> send along with data