package cellphone;
import java.util.*;


public class PhoneBook {
	ArrayList<contact> ContactList= new ArrayList<contact>();
	
	public void addContact(contact info){
		ContactList.add(info);
	}
	public void removeContact(contact info){
		ContactList.remove(info.getname());
	}
	public ArrayList<contact> GetContactList(){
		return ContactList;
		
	}
	
	public contact getConctactInfo(int contactIndexNumber){
			contact info=ContactList.get(0);
	    	return info;
		
	}
	

}
