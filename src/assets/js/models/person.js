var Person = {
	username:'',
	password:'',
	
	var isAuthenicated = function() {
		return Person.username != '' && Person.password != '';
	}
};	