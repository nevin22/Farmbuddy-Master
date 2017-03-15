package cellphone;

public class call implements CPaction {
	@Override
	public void initiateFunction(PhoneBook list) {
		contact info=list.getConctactInfo(0);	
		System.out.println("Iniating Call to: "+info.getname() + " with phone number "+info.getNumber() );
	}

}
