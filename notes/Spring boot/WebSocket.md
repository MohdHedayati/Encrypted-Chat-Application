- Full duplex connection 
- No constant polling required
- Once connection established, data exchange easy , low latency as no requests are made.
- Both sides can send data after connection is established.


***Shifting to WebSockets***
1.  Client sends normal GET request and sends special header containing : request for switching protocol, confirmation for switching protocol and a code for assurance from server.
2. Server sends 101 (Switching protocol) status code, switching to WebSockets