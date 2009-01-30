var Auth = x$.controller('auth', {
	
	before: function() { 
		console.log('Before Auth')
		x$('#tweets').xhr('http://localhost:5984/_all_dbs');
		},
	after: function() { console.log('After Auth')},
	
	'_login.html':function(app){
		// initialize the form to auth the person 
		x$('form').on('submit',function(e){
			Person.username = x$('#username').first().value;	
			Person.password = x$('#password').first().value;
			// TODO real twitter auth..
			// redirect them to the twiddle home
			app.render('twiddle/_index.html')
		});
	},
	
	'_account.html':function(){
		// TODO fetch the user info for display
	}
});