x$.defaults = {
	after:function(){console.log('app.config.after called')},
	before:function(){console.log('app.config.before called')},
	layout:'index.html',  
	container:'#content', 
	index:'_index.html',
	controllers:[],
	models:[]
};



x$.app = function(title, config) {

	// private helper for loading configuration and defaults
	 var parseDefaults = function( cfg ) {
		var choose = function( given, def ) { return (given == undefined) ? def : given; }
		return {
			// application filters
			 after: 	  choose( cfg.after, x$.defaults.after),
			 before:      choose( cfg.before, x$.defaults.before),
			
			 // layouts and templating
			 layout:      choose( cfg.layout, x$.defaults.layout),  	 // default layout used
			 container:   choose( cfg.container, x$.defaults.container), // default element action results will be rendered in
			 index: 	  choose( cfg.index, x$.defaults.index),  		 // default action to load
			
			 // controllers and models
			 controllers: x$.defaults.controllers,
			 models: 	  x$.defaults.models
		}
	};
	
  	// the framework
	var app = {
		
		// setup the defaults
		config:parseDefaults(config),
		
		// array of actions loaded
		history:[],
		
		// renders an action
		render: function(url) {	
			
			
			
			// Check the controller and see if we need to fire anything for this action
			var controller_call = function(){};
			var s = url.split('/');
			
			var controller_method = s[1];
			
			for (var i in app.config.controllers) {
				if (i == s[0])
					controller_call = app.config.controllers[i];	
			}
			
			
			// document.location.hash = u = url.split('/').pop();
			// not sure what this chunk is doing?
			// for(var action in config) {		
			// 	if(typeof action == 'string' && new RegExp(u).test(action))
			// 		config[action]();
			// };
	
			url = "assets/html/" + url;
			
			// If this controller has a before action
			
			if (controller_call['before'] != undefined ) controller_call['before'](app);
			
			x$(app.config.container).xhr( url,{ callback:function(){
				x$(app.config.container).html(this.responseText);
				
				controller_call[controller_method](app);
				
				if (controller_call['after'] != undefined ) controller_call['after'](app);
		
				x$('.nav A').click(function(e) { 
					e.preventDefault();
					app.render(this.href);
					// x$('#back').click(function(){ app.render(app.history.pop() )});
				});
			}});
		}
	};
	
	// initialize the whole shebang
	x$(window).load(function(){
		app.config.before(app.config);
		app.history.push(app.config.index);
		// app.render( document.location.hash.replace("#",'') || app.config.index );
		app.render(app.config.index );		
		app.config.after(app.config);
	});
};


x$.controller = function(path, code) {
	x$.defaults.controllers[path] = code;
	return code;
}

x$.model = function(path, code) {
	x$.defaults.models[path] = code;
	return code;
}










/* JSONPath 0.8.0 - XPath for JSON
 *
 * Copyright (c) 2007 Stefan Goessner (goessner.net)
 * Licensed under the MIT (MIT-LICENSE.txt) licence.
 */
function jsonPath(obj, expr, arg) {
   var P = {
      resultType: arg && arg.resultType || "VALUE",
      result: [],
      normalize: function(expr) {
         var subx = [];
         return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
      },
      asPath: function(path) {
         var x = path.split(";"), p = "$";
         for (var i=1,n=x.length; i<n; i++)
            p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
         return p;
      },
      store: function(p, v) {
         if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
         return !!p;
      },
      trace: function(expr, val, path) {
         if (expr) {
            var x = expr.split(";"), loc = x.shift();
            x = x.join(";");
            if (val && val.hasOwnProperty(loc))
               P.trace(x, val[loc], path + ";" + loc);
            else if (loc === "*")
               P.walk(loc, x, val, path, function(m,l,x,v,p) { P.trace(m+";"+x,v,p); });
            else if (loc === "..") {
               P.trace(x, val, path);
               P.walk(loc, x, val, path, function(m,l,x,v,p) { typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m); });
            }
            else if (/,/.test(loc)) { // [name1,name2,...]
               for (var s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++)
                  P.trace(s[i]+";"+x, val, path);
            }
            else if (/^\(.*?\)$/.test(loc)) // [(expr)]
               P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
            else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
               P.walk(loc, x, val, path, function(m,l,x,v,p) { if (P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)) P.trace(m+";"+x,v,p); });
            else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
               P.slice(loc, x, val, path);
         }
         else
            P.store(path, val);
      },
      walk: function(loc, expr, val, path, f) {
         if (val instanceof Array) {
            for (var i=0,n=val.length; i<n; i++)
               if (i in val)
                  f(i,loc,expr,val,path);
         }
         else if (typeof val === "object") {
            for (var m in val)
               if (val.hasOwnProperty(m))
                  f(m,loc,expr,val,path);
         }
      },
      slice: function(loc, expr, val, path) {
         if (val instanceof Array) {
            var len=val.length, start=0, end=len, step=1;
            loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
            start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
            end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
            for (var i=start; i<end; i+=step)
               P.trace(i+";"+expr, val, path);
         }
      },
      eval: function(x, _v, _vname) {
         try { return $ && _v && eval(x.replace(/@/g, "_v")); }
         catch(e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
      }
   };

   var $ = obj;
   if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
      P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
      return P.result.length ? P.result : false;
   }
} 






