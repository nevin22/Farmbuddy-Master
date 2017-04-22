package cellphone;
//skeleton lang so hardcoded ang mga inputs
public class phone {
	public static void main (String[]args){

	
		PhoneBook phonebook = new PhoneBook();
		contact newContact = new contact();
		ActionGetter action = new ActionGetter();
		
		
		
		
		
		
		
		
		
		
		
    //hardcoded ang pag input sa ngalan ug number		
		String username = "nevin";
		newContact.setName(username);
		String cpnumber = "09061939383";
		newContact.setNumber(cpnumber);
		
		phonebook.addContact(newContact);
		
	// after adding sa phone book mag tawag ta ug operation	
		CPaction operation = action.operation("text");
		operation.initiateFunction(phonebook);
	}

}
