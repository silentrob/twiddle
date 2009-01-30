var Twiddle = x$.controller('twiddle', {
	
	// fetches recent tweets
	'_index.html':function(){
		
		// for now lets just fetch the public timeline json
		var url = 'http://twitter.com/statuses/public_timeline.json';

		x$('#tweets').xhrmap('assets/html/data.json',{
		  	partial:'assets/html/twiddle/_tweet.html',
			partialMap: {
				"user.profile_image_url":'.avatar',
				"user.name":'.username',
				"text":'.message'
			}
		});
	}
});


