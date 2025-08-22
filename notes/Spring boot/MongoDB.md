we use @Document to tell spring that this is the class/interface which is used for ORM (object relation mapping) 


@Transactional Annotation 
1. Used to roll back the complete process if there is some issue(if an entry was saved and while saving its reference somewhere else there was an issue then the entry wont be saved initally too ) rolls back to how it was.