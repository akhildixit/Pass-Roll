function validatePassword(password,confirmPassword, policyRequired) {
	
	var upper_flag = false;
	var lower_flag = false;
	var digit_flag = false;
	var symbol_flag = false;
	if(password.value!=confirmPassword.value){
		alert('Passwords do not match');
		return false;
	}
	var password_length = password.value.length;
	if(password_length < 8){
		alert('Enter a password with minimum 8 length');
		return false;
	}
	
	if(!policyRequired)
		return true;
	
	var passwordChar;
	for(var i=0;i<password_length;i++)
	{
		passwordChar = password.value.charAt(i);
		if (/[A-Z]/.test(passwordChar))
			upper_flag = true;
		else if (/[a-z]/.test(passwordChar)) 
			lower_flag = true;
		else if (/[0-9]/.test(passwordChar)) 
			digit_flag = true;
		else if (/[^\w]/.test(passwordChar) || passwordChar == '_') 
			symbol_flag = true;
	}
	var msg='';
	if(!upper_flag)
		msg+='Minimum one uppercase letter required\n';
	if(!lower_flag)
		msg+='Minimum one lowercase letter required\n';
	if(!digit_flag)
		msg+='Minimum one digit required\n';
	if(!symbol_flag)
		msg+='Minimum one symbol required';
	if(msg!=''){
		alert(msg);
		return false;
	}
	return true;
//	return (upper_flag && lower_flag && digit_flag && symbol_flag);
}