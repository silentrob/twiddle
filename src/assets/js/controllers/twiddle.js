var Twiddle = {
	'_index.html':function(){
		// fetches recent tweets
		x$('#tweets').xhrjson('/twitter/', {partial:'_tweet.html', map:{} });
		
		// enables click to tweet
		
		// enables refresh click
	}
};