var Twiddle = x$.controller('twiddle', {
	
	// fetches recent tweets
	'_index.html':function(){
		
		// for now lets just fetch the public timeline json
		var url = 'http://twitter.com/statuses/public_timeline.json' + '?q=' +  Math.random() 

    	var callback = function() {
	       	console.log('step 1');
/*	
			var js = eval('(' + this.responseText + ')');
			
			// Get the partial in an internal XHR
			if (options.partial) {

	
				var cb2 = function() {
	       			console.log('step 2');
					var part = this.responseText;
					
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
					
					// xui-app-tmp
					x$('#template').html(part);

					// if the json returns an array we're going to loop and create multiple partial
	
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
				}
				x$('#tweets').xhr(options.partial,{callback:cb2});
			}	
			*/

		};
		

		x$('#tweets').xhr(url,{
			callback: function() { console.log('here'); },
		  	partial:'assets/html/twiddle/_tweet.html',
			partialMap: {
				"user.profile_image_url":'.avatar',
				"user.name":'.username',
				"text":'.message'
			}
		});
		
		//-------------------
		
		// TODO click to tweet
		// TODO refresh
	}
});