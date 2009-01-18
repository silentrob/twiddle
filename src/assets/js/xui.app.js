x$.app = function(title, config) {

	// private helper for loading configuration and defaults
	
	 var parseDefaults = function( cfg ) {
	
		var choose = function( given, def ) { return (given == undefined) ? def : given; }

		return {
			// application filters
			 after: 	     choose( cfg.after, function(){console.log('app.config.after called')}),
			 before:      choose( cfg.before, function(){console.log('app.config.before called')}),
			 // layouts and templating
			 layout:      choose( cfg.layout, 'index.html'),  // default layout used
			 container:   choose( cfg.container, '#content'), // default element action results will be rendered in
			 index: 	   	 choose( cfg.index, '_index.html'),  // default action to load
			 // controllers and models
			 controllers: choose( cfg.controllers, []),
			 models: 	 choose( cfg.models, [])
		}
	
	};

	console.log(parseDefaults(config));
	// 
	// // the framework
	// var app = {
	// 	
	// 	// setup the defaults
	// 	config:parseDefaults(config),
	// 	
	// 	// array of actions loaded
	// 	history:[],
	// 	
	// 	// renders an action
	// 	render: function(url) {	
	// 
	// 		document.location.hash = u = url.split('/').pop();
	// 
	// 		// not sure what this chunk is doing?
	// 		for(var action in config) {		
	// 			if(typeof action == 'string' && new RegExp(u).test(action))
	// 				config[action]();
	// 		};
	// 
	// 		x$(app.config.container).xhr( url,{ callback:function(){
	// 			x$(app.config.container).html(this.responseText);
	// 
	// 			x$('.nav A').click(function(e) { 
	// 				e.preventDefault();
	// 				app.render(this.href);
	// 				x$('#back').click(function(){ app.render(app.history.pop() )});
	// 			});
	// 		}});
	// 	}
	// };
	// 
	// 
	// // initialize the whole shebang
	// x$(window).load(function(){
	// 	//app.config.before();
	// 	//app.history.push(app.config.index);
	// 	//app.render( document.location.hash.replace("#",'') || app.config.index );
	// 	//app.config.after();
	// });
};
