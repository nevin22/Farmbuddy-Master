package cellphone;

public class ActionGetter {
	public CPaction operation(String operationName){
		
		if(operationName == "call"){
			return new call();
		}else if(operationName == "text"){
			return new text();
		}
		return null;
		
	}
}
