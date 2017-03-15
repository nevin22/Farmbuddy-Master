package cellphone;

public class text implements CPaction {
	@Override
	public void initiateFunction(PhoneBook list) {
		contact info=list.getConctactInfo(0);	
		System.out.println("Iniating Text to: "+info.getname() + " with phone number "+info.getNumber() );	
	}

}
