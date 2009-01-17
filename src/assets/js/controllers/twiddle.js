var Twiddle = {
		
	// fetches recent tweets
	'_index.html':function(){

		// for now lets just fetch the public timeline json
		var url = 'http://twitter.com/statuses/public_timeline.json'
		
		// the returned json is an array of objs
		// keys are the json paths to the data
		// values are the dom path to where we insert the data
		var partialMap = {
			'user/profile_image_url':'img.avatar[@src]',
			'user/name':'div.username',
			'text':'div.message'
		};
		
		x$('#tweets').xhrjson( url, {partial:'_tweet.html', map:partialMap });
		
		// TODO click to tweet
		// TODO refresh
	}
};