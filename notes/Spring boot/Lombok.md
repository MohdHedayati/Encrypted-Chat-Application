- There are many classes in an application writing getters and setters , constructors is tedious,repetitive and boring most importantly .
- Lombok makes all of these at the time of compilation of the code with just specifying the corresponding fields in the class.
- Implemented using annotations
	1. @Getter and @Setter
	2. @RequiredArgsConstructor(final and @NonNull fields)
	3. @ToString
	4. @EqualAndHashCode
	5. @Data (All above in one )
	6. @AllArgsConstructor and @NoArgsConstructor
	7. @Builder
	8. @Slf4j
*Logger is a advanced print function which let's you tag what type of info is being printed (eg. error , warning , info)


#### Useful Annotations 
1. @Data 
2. @Indexed : to keep any field unique (same arguments cannot be passed to the constructor)
3. @NonNull : if null throws null pointer exception