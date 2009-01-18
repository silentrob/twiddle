var Person = {
	username:'',
	password:'',
	
	isAuthenicated: function() {
		return Person.username != '' && Person.password != '';
	}
};	