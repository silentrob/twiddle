var Person = x$.model('Person', {
	username:'',
	password:'',
	
 	isAuthenticated: function() {
		return Person.username != '' && Person.password != '';
 	}
});	
