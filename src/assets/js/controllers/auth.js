var Auth = {
	
	'_login.html':function(){
		// initialize the form to auth the person 
		x$('form').submit(function(e){
			Person.username = x$('#username');
			Person.password = x$('#password');
			// TODO real twitter auth..
			// redirect them to the twiddle home
			app.render('twiddle/_index.html')
		});
	},
	
	'_account.html':function(){
		// TODO fetch the user info for display
	}
};