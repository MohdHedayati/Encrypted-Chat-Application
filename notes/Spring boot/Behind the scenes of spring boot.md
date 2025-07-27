1. Object Creation(Application Context & IOC Container)
	- We use  to create object manually in java.
	- but when we use spring boot it has IOC(Inversion of control) container which gives control of making objects and managing it to spring boot(automated).
	- Spring has Application Context class (which basically tells spring that hey this is a class which you should look at create object, manage)
		***IOC Container is the concept , Application Context is the actual Java class where beans are stored
		- @context thing used just above a class,interface,method,field.
		- @context annotation  convert class -> bean
		- beans are the things stored in Application Context class.
	- @SpringBootApplication is the annotation use to tell spring boot :
		1. @ComponentScan - to look for beans .
		2. @EnableAutoConfiguration – configure everything for me.
		3. @Configuration - configure this class
		- Any java class where you add annotation must be under the same folder as class containing @SpringBootApplication
