var Twiddle = {
		
	// fetches recent tweets
	'_index.html':function(){
		
		// for now lets just fetch the public timeline json
		var url = 'http://twitter.com/statuses/public_timeline.json'
		
		// the returned json is an array of objs
		// keys are the json paths to the data
		// values are the dom path to where we insert the data
		// var partialMap = {
		// 	'user/profile_image_url':'img.avatar[@src]',
		// 	'user/name':'div.username',
		// 	'text':'div.message'
		// };
		
//		x$('#tweets').xhrjson( url, {partial:'_tweet.html', map:partialMap });
		
		
    var callback = function() {
				// Get the partial in an internal XHR
				var partial = null;
				if (options.partial) {

					var cb2 = function() {
						partial = this.responseText;
					}
					
					x$('#tweets').xhr(options.partial,{callback:cb2});
					
				}
				
        var o = eval('(' + this.responseText + ')');

				// This is the tricky part, we need to put the partial into the DOM so we can select it with querySelectorAll
				// Perhaps a fragment might work, but it dosent work with innerHTML, so I will need to re-write x$.wrap
				// x(fragment).html(partial)
				//console.log(options.partialMap);
        for (var prop in o) {
        		for (var n in o[prop]) {
							console.log(n);							
						}
//						x$('#tweets').html('bottom',partial);
//						x$(options.map[prop]).html( cb(o[prop]) ); 

				}
				
    }

		var options = {};
	  options.callback = callback;
	  options.partial = 'assets/html/twiddle/_tweet.html';
		options.partialMap = {
			'user/profile_image_url':'img.avatar[@src]',
			'user/name':'div.username',
			'user/text':'div.message'
		};


		x$('#tweets').xhr('assets/html/data.json',options);
		
		// TODO click to tweet
		// TODO refresh
	}
};