var Twiddle = x$.controller('twiddle', {
	
	// fetches recent tweets
	'_index.html':function(){
		
		// for now lets just fetch the public timeline json
		var url = 'http://twitter.com/statuses/public_timeline.json'
		
    	var callback = function() {
			// Get the partial in an internal XHR
			var partial = null;
			if (options.partial) {
				var cb2 = function() {
					partial = this.responseText;
				}
				x$('#tweets').xhr(options.partial,{callback:cb2});
			}
			
			// xui-app-tmp
			x$('#template').html(partial);
			
			// -- where we need to do dom insertion	
			var createDefaultsElement = function(html) {
				var extn = html.split('.').pop();
				var valid = ['jpg','jpeg','png','gif'];
				for( var i = 0; i < valid.length; i++ ) {
					if( valid[i] == extn ) {
						var img = new Image();
						img.src = html;
						return img;
					}
				}
				return html;
			}
			// if the json returns an array we're going to loop and create multiple partials
         	var js = eval('(' + this.responseText + ')');
			var len = js.length;
			// first we loop thru the json array
			for( var i = 0; i < len; i++ ) {
				// then we loop thru our partial map
				for (var j in options.partialMap) {
					var nodeKey = j;
					var selector = options.partialMap[j];
					var val = jsonPath(js[i],'$.'+nodeKey)[0];
					x$('#template ' + selector).html(createDefaultsElement(val));
				}
				// clone partial here....
				var temp = x$('#template .tweet').first();
				var dup = temp.cloneNode(true);
				x$("#tweets").html('bottom',dup);
				
			}
			// if the json returns on obj we just insert as per the map into a single obj
		};
		
		
		
		//----------------
		
		var options = {};	  	
		options.callback = callback;
	  	options.partial = 'assets/html/twiddle/_tweet.html';

		options.partialMap = {
			"user.profile_image_url":'.avatar',
			"user.name":'.username',
			"text":'.message'
		};

		x$('#tweets').xhr('assets/html/data.json',options);
		
		//-------------------
		
		// TODO click to tweet
		// TODO refresh
	}
});