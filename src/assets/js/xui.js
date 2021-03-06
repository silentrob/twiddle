/*
* XUI
* ===
* 
* A simple javascript framework for building mobile web applications.
* ---
*
* ### WHY?!
*
* We hear your words. _Why another JavaScript framework?!_ When development of PhoneGap was under way we noticed slow
* load times for modern JavaScript frameworks (such as Prototype, MooTools, YUI, Ext and (yes) even jQuery. 
* A big reason why these libraries are so big is because  is mostly they contain a great deal of cross browser 
* compatability code. The mobile space has less browser implementations (so far) and different needs. Thus XUI.
* 
* XUI strives to be a framework for first class mobile device browsers such as WebKit, Fennec and Opera with future 
* support under consideration for IE Mobile and BlackBerry.
*
* ### Authors
*
* - Rob Ellis
* - Brock Whitten
* - Brian LeRoux
* 
* ### Download
* 
* Minified code is less than 6k! _official builds coming soonish - Brian Jan 6, 2009_
* 
* ### Contribute
*
* Clone the source from GitHub:
*
* 	git clone git://github.com/brianleroux/xui.git
*
* To build xui: run _rake_ in the shell of your choice from the root of the project directory. (This requires Ruby.)
* There are other tasks for code minification, running the specs and generating docs. Run `rake -T` to see them all.
* 
* Check out the _example_ directory for a comprehensive example application. Specs are in the _spec_ directory. 
* 
* API Documentation
* ===
* 
* Welcome the XUI documentation. This is generated from inline documentation in the xui javascript source.
*
* 
* 
* Basics
* ---
*	
* XUI is available to the entire document as x$. It is a function, that accepts a query selector. The syntax is 
* mostly chainable and should be familiar to anyone who has worked with jQuery.
*
* 	x$('a.navigation').css({ background:'blue' });
* 
* The query selection engine is based on the browser implementation of querySelectorAll so its fast. Real fast.
* XUI allows for a single expression, an element or an array of elements to be passed
* 
* 	x$(window);
*
* 
*/
(function() {
	var _$ = function(els) {
		return this.find(els);
	};
	
	_$.prototype = {
		
		elements:[],
		
		find: function(q) {
			this.elements = []; // should it behave like this?

			var qlen = q.length;
			for(var i = 0; i < qlen; i++ ) {
				if( typeof q[i] == 'string' ) {
					var list = document.querySelectorAll(q[i]);
					var size = list.length;
					
					for(var j = 0; j < size; j++ ) {          
						this.elements.push(list[j]);   
					}
				} else {
					this.elements.push(q[i]);
				}
				
			};
			return this;
		},
		
		first: function() {
			return this.elements[0];
		},
		
	  	each: function(fn) {
			for( var i = 0, len = this.elements.length; i<len; ++i ) {
				fn.call(this,this.elements[i]);
			}
			return this;
		},

		// merges sub lib objects
		extend: function( libObj ) {
			for(var x in libObj) {
				this[x] = libObj[x];
			}
		}
	};
	

	// adds the xui system as x$ to the current window
	var xui = window.x$ = function() {
				
		/**
		*
		* Dom
		* ---
		*	
		* Manipulating the document object model (DOM).
		* 
		*/
		var Dom = {
		
			/**
			*
			* ### html
			*
			* Adds elements or changes the content of an element on a page.
			*	
			* syntax:
			*
			* 	x$(window).html( location, htmlFragment );
			*
			* or..
			*
			* 	x$(window).html( htmlFragment );
			* 
			* arguments:
			* 
			* - location:string can be one of inner, outer, top, bottom
			* - htmlFragment:string any string of html markup
			*
			* example:
			*
			*  	x$('#foo').html( 'inner',  htmlFragment );
			*  	x$('#foo').html( 'outer',  htmlFragment );
			* 	x$('#foo').html( 'top',    htmlFragment );
			*  	x$('#foo').html( 'bottom', htmlFragment );
			*  	x$('#foo').html( 'remove' );	
			* 
			* or
			* 
			* 	x$('#foo').html('<p>sweet as honey</p>');
			* 
			*/
			
			
		    html:function(location, html) {
				
				// private method for finding a dom element 
				var getTag = function(el) {
					
					if (el.firstChild == null) {
						switch(el.tagName) {
							case 'UL': return 'LI'; break;
							case 'DL': return 'DT'; break;
							case 'TR': return 'TD'; break;
							default: return el.tagName;
						}
					}
					return el.firstChild.tagName;
				};
			
				// private method
			    // Wraps the HTML in a TAG, Tag is optional
			    // If the html starts with a Tag, it will wrap the context in that tag.
			    var wrap = function(xhtml,tag) {
			        var attributes = {};
			        var re = /^<([A-Z][A-Z0-9]*)(.*)[^>]*>(.*?)<\/\1>/i;
			        if(re.test(xhtml)) {
			            result = re.exec(xhtml);
		
			            tag = result[1];
								
			            // if the node has any attributes, convert to object
			            if (result[2] != "") {
											
							var attre = /([a-zA-Z]*\s*=\s*['|"][a-zA-Z0-9:;#\s]*['|"])/;								
			                var attrList = result[2].split(attre);
		
			                for(var i=0;i<attrList.length;i++){
			                    if (attrList[i] != "" && attrList[i] != " ") {
			                        var node = attrList[i].split('=');
			                        attributes[node[0]];
			                        attributes[node[0]] = node[1].replace(/(["']?)/g,'');
			                    }
			                }
			            }
			            xhtml = result[3];
			        }
		
			        var element = document.createElement(tag);
			        element.innerHTML = xhtml;
			        for (var i in attributes) {
			            var a = document.createAttribute(i);
			            a.nodeValue = attributes[i];
			            element.setAttributeNode(a);
			        }
		
			        return element;
			    };
		
				this.clean();
		
				if (arguments.length == 1 && arguments[0] != 'remove') {
					html = location;
					location = 'inner';
				}	
								
		        this.each(function(el) {
		            switch(location) {
		                case "inner": 
							if (typeof html == 'string') {
								el.innerHTML = html; 
							} else {
								el.innerHTML = ''; 
								el.appendChild(html);
							}
							break;
		                case "outer":
		                    if (typeof html == 'string') html = wrap(html, getTag(el));
		                    el.parentNode.replaceChild(html,el);
		                break;
		                case "top":
		                    if (typeof html == 'string') html = wrap(html, getTag(el));
		                    el.insertBefore(html,el.firstChild);
		                break;
		                case "bottom":
		                    if (typeof html == 'string') html = wrap(html, getTag(el));
		                    el.insertBefore(html,null);
		                break;
						case "remove": 
							var parent = el.parentNode;
							parent.removeChild(el);
						break;
		            }
		      	});
		        return this;
		    },
		
		
			
			// This is needed el.node will return something useless without it.
			clean:  function() {
		  		var ns = /\S/;
		 		this.each(function(el) {
					var d = el, n = d.firstChild, ni = -1;
					while(n) {
			 	  		var nx = n.nextSibling;
				 	    if (n.nodeType == 3 && !ns.test(n.nodeValue)) {
				 	    	d.removeChild(n);
				 	    } else {
				 	    	n.nodeIndex = ++ni;
				 	    }
				 	    n = nx;
				 	}
				});
		 	  return this;
		 	}
		};
		
		
		/**
		*
		* Event
		* ---
		*	
		* A good old fashioned event handling system.
		* 
		*/
		var Event = {
		
			eventfunctions : [],
			
			click: 		   		function(fn) { return this.on('click',fn); },
			load: 		   		function(fn) { return this.on('load',fn); },
			touchstart:    		function(fn) { return this.on('touchstart',fn); },
			touchmove: 	   		function(fn) { return this.on('touchmove',fn); },
			touchend: 	   		function(fn) { return this.on('touchend',fn); },
			touchcancel:   		function(fn) { return this.on('touchcancel',fn); },
			gesturestart:  		function(fn) { return this.on('gesturestart',fn); },
		  	gesturechange: 		function(fn) { return this.on('gesturechange',fn); },
		  	gestureend:    		function(fn) { return this.on('gestureend',fn); },
			orientationchange: 	function(fn) { return this.on('orientationchange',fn); },
			/**
			*
			* ### on
			* 
			* Registers a callback function to a DOM event on the element collection.
			* 
			* This method has shortcut aliases for: 
			*
			* - click
			* - load
			* - touchstart
			* - touchmove
			* - touchend
			* - touchcancel
			* - gesturestart
			* - gesturechange
			* - gestureend
			* - orientationchange
			*
			* For more information see:
			* 
			* - http://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/chapter_7_section_1.html#//apple_ref/doc/uid/TP40006511-SW1
			*
			* syntax:
			*
			* 	x$('button').on( 'click', function(){ alert('hey that tickles!') });
			*
			* arguments:
			*
			* - type:string the event to subscribe to click|load|etc
			* - fn:function a callback function to execute when the event is fired
			*
			* example:
			* 	
			* 	x$(window).load(function(e){
			* 		x$('.save').touchstart( function(evt){ alert('tee hee!') });	
			*  	});
			* 	
			*/
			on: function(type, fn) {
			    var listen = function(el) {
			        if (window.addEventListener) {
			            el.addEventListener(type, fn, false);
			        }
			    };
			    this.each(function(el) {
			        listen(el);
			    });
			    return this;
			}
		};
		
		
		/**
		*
		* Style
		* ---
		*	
		* Anything related to how things look. Usually, this is CSS.
		* 
		*/
		var Style = {
		
			/**
			*
			* ### setStyle
			*	
			* syntax: 
			*
			* 	x$(selector).setStyle(property, value);
			*
			* arguments: 
			*
			* - property:string the property to modify
			* - value:string the property value to set
			*
			* example:
			* 
			* 	x$('.txt').setStyle('color', '#000');
			* 
			*/
			setStyle: function(prop, val) {
		      this.each(function(el) {
		        el.style[prop] = val;
		      });
			  return this;
			},
		
			/**
			*
			* ### getStyle
			*	
			* syntax: 
			*
			* 	x$(selector).getStyle(property, callback);
			*
			* arguments: 
			* 
			* - property:string a css key (for example, border-color NOT borderColor)
			* - callback:function (optional) a method to call on each element in the collection 
			*
			* example:
			*
			*	x$('ul#nav li.trunk').getStyle('font-size');
			*	
			* 	x$('a.globalnav').getStyle( 'background', function(prop){ prop == 'blue' ? 'green' : 'blue' });
			*
			*/
			getStyle: function(prop, callback) {
				
				var gs = function (el,p) {
					return document.defaultView.getComputedStyle(el , "").getPropertyValue(p);
				}
		
				if(callback == undefined)  
					return gs(this.first(),prop);
				
		   		this.each( function(el) {
					callback(gs(el,prop));
		   		});
			  	return this;
			},
		
			/**
			*
			* ### addClass
			*	
			* syntax:
			*
			* 	$(selector).addClass(className);
			* 
			* arguments:
			*
			* - className:string the name of the CSS class to apply
			*
			* example:
			* 
			* 	$('.foo').addClass('awesome');
			*
			*/
			addClass: function(className) {
				var that = this;
				var hasClass = function(el,className) { var re = that.getClassRegEx(className); return re.test(el.className); }
				
				this.each(function(el) {
					if (hasClass(el,className)==false)
						el.className += ' '+className;
				});
				return this;
			},
			
			/**
			*
			* ### removeClass
			*	
			* syntax:
			*
			* 	x$(selector).removeClass(className);
			* 
			* arguments:
			*
			* - className:string the name of the CSS class to remove.
			*
			* example:
			* 
			* 	x$('.awesome').removeClass('awesome');
			* 
			*/
			removeClass:function(className) {
			    var re = this.getClassRegEx(className);
			    this.each(function(el) {
			        el.className = el.className.replace(re, ' ');
			    });
			    return this;
			},
			
			/**
			*
			* ### css
			*	
			* syntax: 
			*
			* 	x$(selector).css(object);
			*
			* arguments: 
			*
			* - an object literal of css key/value pairs to set/modify style on.
			*
			* example:
			* 
			* 	x$('#box5').css({ backgroundColor:'blue', width:'100px', border:'2px solid red' });
			*  
			*/
			css: function(o) {
				var that = this;
				this.each(function(el) {
					for (var prop in o) {
						that.setStyle(prop, o[prop]);
					}
				});
				return this || that;
			},
			
			// -- private methods -- //
			
			reClassNameCache: {},
		
			getClassRegEx: function(className) {
			    var re = this.reClassNameCache[className];
			    if (!re) {
			        re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
			        this.reClassNameCache[className] = re;
			    }
			    return re;
			}
			
			//toggleClass:function(className) {
			//    var that = this;
			//    this.each(function(el) {
			//        (this.hasClass(el,className)==true)? this.removeClass(className) : this.addClass(className);
			//      });
			//    return this;
			//},
			//
			//position: function () {
			//	this.each(function(el){
			//    	var topValue= 0,leftValue= 0;
			//        var obj = el;
			//        while(obj) {
			//            leftValue += obj.offsetLeft;
			//            topValue  += obj.offsetTop;
			//            obj 	  =  obj.offsetParent;
			//        }
			//        el.leftPos = leftValue;
			//        el.topPos = topValue;
			// 	});
			//   	return this;
			//}
		
		};
		
		
		/**
		*
		* Fx
		* ---
		*	
		* Animations mostly but we're not excluding any ideas.
		* 
		*/
		var Fx = {
		
			/**
			*
			* ### tween
			*	
			* syntax:
			* 
			* 	x$('#box').tween({ left:100px, backgroundColor:'blue' });
			* 	
			* 	x$('#box').tween([{ left:100px, backgroundColor:'green', duration:.2 }, { right:100px }]);
			* 	
			* 	x$('#box').tween({ left:100px}).tween({ left:100px });
			*
			* arguments:
			* 
			* properties:object an object literal of element properties to tween.
			* 
			* _or_
			*
			* queue:array an array literal of objects which contain properties to tween sequentially.
			*
			* example:
			* 
			*/
			tween: function( options ) {
			    if (options instanceof Array) {
			        for(var i=0;i<options.length;i++) {
			            this.animationStack.push(options[i]);                   
			        }
			    } else if (options instanceof Object) {
			        this.animationStack.push(options);
			    }
		  
			    this.start();
			    return this;
			},
		
			// -- private -- //
		
			// TODO should this be private __animationStack?
			animationStack: [],
		
			start:function() {
			    var t = 0;
			    for (var i = 0; i< this.animationStack.length;i++) {
			        var options = this.animationStack[i];
			        var duration     = options.duration == undefined ? .5    : options.duration;
			        setTimeout(function(s,o){s.animate(o);},t*1000*duration,this,options);
			        t += duration;
			    }
		  
			    return this;
			},
		  
			animate: function(options) {   
			    var that = this;
		   
			    var opt_after = options.after;
		   
			    var easing = (options.easing == undefined) ? 'ease-in' : options.easing;
			    var before = (options.before == undefined) ? function(){} : options.before;    
			    var after = (opt_after == undefined) ? function(){} : function() {  opt_after.apply(that); };    
			    var duration = (options.duration == undefined) ? .5 : options.duration;
		   
					var translate = options.by;
					var rotate = options.rotate;
					
			    options.easing = options.rotate = options.by = options.before = options.after = options.duration = undefined;
			    before.apply(before.arguments);
		   
			    // this sets duration and easing equation on a style property change
			    this.setStyle( '-webkit-transition', 'all ' + duration + 's ' + easing );
		   
			    // sets the starting point and ending point for each css property tween
			    this.each( function(el) {
			        for( var prop in options ) {
			            that.setStyle( prop, options[prop] )
			        }
			 				if (translate) {
								that.setStyle('-webkit-transform', that.translateOp(translate[0],translate[1]));
							}
							
							// if (rotate) {
							// 	for(var x in rotate) {
							// 		that.setStyle('-webkit-transform', that.rotateOp(x,rotate[x]));
							// 	}
							// }
		
			    });
		
			    setTimeout(function(){ that.setStyle('-webkit-transition','none');},duration*1000)
			    setTimeout(function(){ that.setStyle('-webkit-transform','none');},duration*1000)	
			    setTimeout(after,duration*1000);
		
			    return this || that; // haha
			},
			
			translateOp: function(xPixels, yPixels) {
			    return 'translate(' + xPixels + 'px, ' + yPixels + 'px)';
			},
			
			rotateOp: function(axis, degree){
			    return 'rotate' + axis + '(' + degree + 'deg)';
			}
			
		};
		
		
		/**
		*
		* Xhr
		* ---
		*	
		* Remoting methods and ultilites. 
		* 
		*/
		var Xhr = {	
		
			/**
			* ### xhr 
			*	
			* syntax:
			*
			* `xhr('path/to/file.html', {});`
			* 
			* arguments:
			*
			* url:string the url for request
			* 
			* options:object
			*
			* - method:string get|put|delete|post default get
			* - async:boolen default false
			* - data:string url encoded string of parameters to send
			* - callback:function to call on 200 status
			*
			* - Returns responseText back 
			* example:
			* 
			*/
		    xhr:function(url,options) {   
		         
		        if (options == undefined) var options = {};
		
		    	var that   = this;
		    	var req    = new XMLHttpRequest();
		        var method = options.method || 'GET';
		        var async  = options.async || false ;
		        var params = options.data || null;
		        req.open(method,url,async);
		        req.onload = (options.callback != null) ? options.callback : function() { that.html(this.responseText); }
		        req.send(params);
		    	
		      	return this;
		    },
				
			xhrmap: function(url,opt) {
				var that = this;
				var options = {

					callback:function(){
						var self = that;
						var js = eval('(' + this.responseText + ')');					

						that.xhr(opt.partial,{
							callback:function() {

								var part = this.responseText;
							
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
								x$('BODY').html('top','<div id="xui-app-tmp">HERE</div>');
								x$('#xui-app-tmp').html(part);

								var len = js.length;
								// first we loop thru the json array
								for( var i = 0; i < len; i++ ) {

									// then we loop thru our partial map
									for (var j in opt.partialMap) {
										var nodeKey = j;
										var selector = opt.partialMap[j];
										var val = jsonPath(js[i],'$.'+nodeKey)[0];
										x$('#template ' + selector).html(createDefaultsElement(val));
									}
									// clone partial here....
									var temp = x$('#'+ class +' .tweet').first();
									var dup = temp.cloneNode(true);
									x$("#tweets").html('bottom',dup);

								}
								

							}
						});
					
					}
				 }

		        this.xhr(url,options);							
			
				return this;
			},
			/**
			* ### xhrjson 
			*	
			* syntax:
			*
			* `xhr('path/to/file.html', {});`
			* 
			* arguments:
			* 
			* url:string the url for request
			*
			* options:object (Options is the same as XHR with map:object and new callback:function)
			*
			* - method:string get|put|delete|post default get
			* - async:boolen default false
			* - data:string url encoded string of parameters to send
			* - map:object {'dom selector':'json key'}
			* - callback:function - this function is applied to each json value
			* 
			*/
		    xhrjson:function(url,options) {
		        if (options == undefined) return this;
		        var that = this;
		
		        var cb = options.callback;
		        if (typeof cb != 'function') { var cb = function(x) {return x; }}
		  
		        var callback = function() {
		            var o = eval('(' + this.responseText + ')');
		            for (var prop in o) { x$(options.map[prop]).html( cb(o[prop]) ); }
		        }
		        options.callback = callback;
		        this.xhr(url,options);
		        return this;
		    },
		  
		    xhrForm: function() {
		        var that = this;
		      // ideally I would like to return the first form staring at this element selector
		      this.each(function(e) {
		            if (e.tagName == "FORM") {
		                var options = {};
		                options.method = e.method;
		                options.data = "one=two";
		              
		                that.xhr(e.action,options);
		            }
		        });
		        return this;
		    }
		};
		

	
		var libs = [Dom,Event,Style,Fx,Xhr];
		var size = libs.length;
		var that = new _$(arguments);
		
		for( var i = 0; i < size; i++ ) {
			that.extend( libs[i] );
		}
	
		return that;
	}

})();

/*
* TODO
* ---
* 
* - look into lib loading / extend method buggyness
* - more tests!!!
* - get jslint passing
* - better docs (generate side by side code like ubiquity)
* - inspect and generate example from markdown
* - generators
* - canvas progressive enhancement
* - prop should be JS property, not CSS property
*
* Changelog
* ---
* 
* _jab 21, 2009_
*
* - fixed DOM
* - added remove
*
* _Jan 18, 2009_
* 
* - more documentation for core, etc
* - after cat getting out of the bag on ajaxian we're working furiously to get this production ready
*
* _Jan 13, 2009_
*
* - merged robs fixes and cleanup
* 
* _Jan 11, 2009_
*
* - added mobile safari events (these will need testing in android, etc)
* - cleaned up Dom.html and documented
* - documented event a little
* 
* _Jan 10, 2009_
* 
* - removed Dom.clean for now
* - made Dom.getTag and Dom.wrap private 
* - documented Dom
* - more Dom tests
* 
* _Jan 9, 2009_
*
* - more docs for xui core, xhr, style and fx
*
* _Jan 7, 2009_
* 
* - style spec passing
* - xui app phase one
* - testing approch resolved
* - hasClass now private
* 
* _Jan 6, 2009_
*
* - rock out with renewed authority
* - better docs we promise
* - create doc/index.html from markdown
* 
* LICENSE
* ---
* 
* _Copyright (c) 2008 Brian LeRoux, Brock Whitten, Rob Ellis_
* 
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
* 
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
