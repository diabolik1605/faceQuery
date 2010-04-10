/*
 * faceQuery is a `jQuery-like` FBJS Wrapper
 */
function $(selector) {
  var that;
	// Is the selector an object or string?
	var type = typeof selector;
	if (type === "object") {
    that = selector;
	} else if (type === "string") {
		/*
		 * What type of selector are we dealing with?
		 *    "#" : get element by id
		 *    "." : get elements by class
		 *    @todo: add more selector types, including selectors that return aggregates
		 */
		var quickExpr = /([#|\.])([\w-]+)$/;
		var match = quickExpr.exec( selector );
		// console.log(match);
		var selectorIdent = match[1];
		switch(selectorIdent){
		    case "#":
		    	var id = match[0].substring(1);
		    	that = document.getElementById(id);
		    	break;
		    case ".":
		    	var klass = match[0].substring(1);
		    	var klassArry = [];
		    	var root = document.getRootElement();
		    	var rootChildren = root.getChildNodes();
		    	rootChildren.forEach(function(item){
		    	  if(typeof(item) === 'object' && item.hasClassName(klass)){
		    	      klassArry[klassArry.length] = item;
		    	  }
		    	}, rootChildren);
		    	that = klassArry;
		    	break;
		    default:
		    	that = document.getElementById(match[0]);
		    	break;
		}
	}
	if(that){
	  faceQuery(that,fqExtend);
	}
	return that;
}


function faceQuery(instance,hash) {
  for (var name in hash) {
      instance[name] = hash[name];
  }
}

var fqExtend = {
  visible: function() {
    var display = this.getStyle('display');
    if (display != 'none' && display != null){
      return true;
    } else if(display != 'none'){
      return true;
    } else {
      return false;
    }
  },
  hide: function() {
    return this.setStyle({ display:'none' });
  },
  show: function() {
    return this.setStyle({ display:'block' });
  },
  fadeToggle: function(){
    if (this.visible()) {
        return this.fadeOut();
    } else {		
        return this.fadeIn();
    }
  },
  fadeOut: function(value, easetype){
    // if value is defined a duration in milliseconds is added
    if(typeof(value) != 'undefined'){
      // Facebook Builtin Animation Ease Types: 
      // Animation.ease.begin - Animation.ease.end - Animation.ease.both
      if (typeof(easetype) != 'undefined'){
    	  Animation(this).to('opacity', 0).from(1).hide().duration(value).ease(easetype).go();
      } else {
    	  Animation(this).to('opacity', 0).from(1).hide().duration(value).go();
      }
    } else {
      Animation(this).to('opacity', 0).from(1).hide().go();
    }
  },
  fadeIn: function(value, easetype){
    if(!this.visible()){
        // if value is defined a duration in milliseconds is added
        if(typeof(value) != 'undefined'){
          // Facebook Builtin Animation Ease Types: 
          // Animation.ease.begin - Animation.ease.end - Animation.ease.both
          if (typeof(easetype) != 'undefined'){
        	  Animation(this).to('opacity', 1).from(0).show().duration(value).ease(easetype).go();
          } else {
        	  Animation(this).to('opacity', 1).from(0).show().duration(value).go();
          }
        } else {
          Animation(this).to('opacity', 1).from(0).show().go();
        }
    }
  },
  slideToggle: function(){
    if (this.visible()) {
        return this.slideUp();
    } else {		
        return this.slideDown();
    }
  },
  slideUp: function(value, easetype){
    // if value is defined a duration in milliseconds is added
    if(typeof(value) != 'undefined'){
      // Facebook Builtin Animation Ease Types: 
      // Animation.ease.begin - Animation.ease.end - Animation.ease.both
      if (typeof(easetype) != 'undefined'){
    	  Animation(this).to('height', '0px').blind().hide().duration(value).ease(easetype).go();
      } else {
    	  Animation(this).to('height', '0px').blind().hide().duration(value).go();
      }
    } else {
      Animation(this).to('height', '0px').blind().hide().go();
    } 
  },
  slideDown: function(value, easetype){
    if(!this.visible()){
        // if value is defined a duration in milliseconds is added
        if(typeof(value) != 'undefined'){
          // Facebook Builtin Animation Ease Types: 
          // Animation.ease.begin - Animation.ease.end - Animation.ease.both
          if (typeof(easetype) != 'undefined'){
        	  Animation(this).to('height', 'auto').from('0px').blind().show().duration(value).ease(easetype).go();
          } else {
        	  Animation(this).to('height', 'auto').from('0px').blind().show().duration(value).go();
          }
        } else {
          Animation(this).to('height', 'auto').from('0px').blind().show().go();
        }   
    }
  },
  /* 
  * method: parent()
  *    returns object parent
  */
  parent: function() {
    return this.getParentNode();
  },
  /* 
  * method: children()
  *    returns array of children in object
  */
  children: function() {
    return this.getChildNodes();
  },
  /* 
  * method: remove()
  *    removes object from DOM
  */
  remove: function() {
    this.getParentNode().removeChild(this);
    return null;
  },
  /* 
  * method: empty()
  *    removes all children in object
  */
  empty: function() {
    while (this.getFirstChild()) {
	this.removeChild(this.getFirstChild());
    }
    return null;
  },
  /*
  * method: getDimensions()
  *    returns calculated element size hash
  */
  getDimensions: function() {
      var display = this.getStyle('display');
      if (display != 'none' && display != null) // Safari bug
          return {
              width: this.getOffsetWidth(),
              height: this.getOffsetHeight()
              };

      // All *Width and *Height properties give 0 on elements with display none,
      // so enable the element temporarily
      var originalVisibility = this.getStyle("visibility");
      var originalDisplay = this.getStyle("display");
      var originalPosition = this.getStyle("position");
      this.setStyle('visibility','none');
      this.setStyle('display','block');
      this.setStyle('position','absolute');
      var originalWidth = this.getClientWidth();
      var originalHeight = this.getClientHeight();
      this.setStyle('visibility',originalVisibility);
      this.setStyle('display',originalDisplay);
      this.setStyle('position',originalPosition);

      return {
          width: originalWidth,
          height: originalHeight
      };
  },
  /*
  * method parentOffsets()
  *		returns offsets according to parent
  */
  parentOffsets: function() {
  	var parentElement = this.getParentNode();
  	var parentOffsets = {
  		top: parentElement.getAbsoluteTop(),
  		left: parentElement.getAbsoluteLeft()
  	};
  	return {
  		top: this.getAbsoluteTop()-parentOffsets.top,
  		left: this.getAbsoluteLeft()-parentOffsets.left
  	}
  },
  /*
  * method canvasOffsets()
  *		returns offsets according to canvas
  */
  canvasOffsets: function() {
  	var rootElement = this.getRootElement();
  	var rootOffsets = {
  		top: rootElement.getAbsoluteTop(),
  		left: rootElement.getAbsoluteLeft()
  	};
  	return {
  		top: this.getAbsoluteTop()-rootOffsets.top,
  		left: this.getAbsoluteLeft()-rootOffsets.left
  	}
  },
  /* 
  * method: attr(item,[value])
  *    gets or sets the following attributes
  *    - class, src, id, title, name
  *    if item is an object it loops through
  *    NOTE: to work cross-browser keys must 
  *    be in quotes {"id":"val","src":"val"}
  */
  attr: function(item, value){
    if(typeof(item) === 'object') {
  		for(var attr in item){
  			if (item.hasOwnProperty(attr)) {
  				if(attr = "class") { return this.addClassName(item[attr]); } 
  				else if(attr = "src") { return this.setSrc(item[attr]); } 
  				else if(attr = "id") { return this.setId(item[attr]); } 
  				else if(attr = "title") { return this.setTitle(item[attr]); } 
  				else if(attr = "name") { return this.setName(item[attr]); }
  			}
  		}
  	} else if(typeof(item) === 'string') {
  		if(typeof(value) != 'undefined') {
  			switch(item) {
  				case "class": return this.addClassName(value); break;
  				case "src": return this.setSrc(value); break;
  				case "id": return this.setId(value); break;
  				case "title": return this.setTitle(value); break;
  				case "name": return this.setName(value); break;
  			} 
  		} else {
  			switch(item) {
  				case "src": return this.getSrc(value); break;
  				case "id": return this.getId(value); break;
  				case "title": return this.getTitle(value); break;
  				case "name": return this.getName(value); break;
  			}
  		}   
  	}
  },
  /* 
  * method: xhtml(value)
  *    sets inner xhtml for an object.
  */	
  xhtml: function(value) {
    // setInnerXHTML will fail unless you make sure `value` has one root container
    return this.setInnerXHTML('<span>' + value + '</span>');
  },
  /*
  * method: html(value)
  *    alias for xhtml
  */	    
  html: function(value){
    return this.setInnerXHTML('<span>' + value + '</span>');
  },
  /* 
  * method: fbml(value)
  *    set inner fbml for an object.
  *    value must be an fb:js-string variable, or
  *    data returned from an FBJS Ajax call with
  *    dataType set to Ajax.FBML
  */	        
  fbml: function(value){
    return this.setInnerFBML(value);
  },
  /*
  * method: text(value)
  *    shortcut for .setTextValue()
  */
  text: function(value){
   return this.setTextValue(value);
  },
  /*
  * method: val(value)
  *    set or get value of object.
  */
  val: function(value){
    if(typeof(value) != 'undefined') {
      return this.setValue(value);
    } else {
      return this.getValue(value);
    }
  },
  /*
  * method: append(element) 
  *	shortcut for appendChild
  */
  append: function(element){
    return this.appendChild(element);
  },
  /*
  * method: prepend(element) 
  *	appends element before parentElement
  */
  prepend: function(element){
    var thatParent = this.getParentNode();
    return thatParent.insertBefore(element,thatParent);
  },
  /*
  * method: click(fnc) 
  *	sets click event listener with callback function
  */
  click: function(fnc){
    if(this.attachEvent){
  	  return this.attachEvent('onclick', fnc);
    } else if(this.addEventListener){
  	  return this.addEventListener('click', fnc, false);
    }
  },
  /*
  * method: hover(fncOver,fncOut) 
  *	sets hover event listener with callback function
  *	Note: needs both hoverover and hoverout functions
  *	to be set to work properly
  */
  hover: function(fncOver,fncOut){
    if(this.attachEvent){
  	  this.attachEvent('mouseover', fncOver);
  	  this.attachEvent('mouseout', fncOut);
  	  return this;
    } else if(this.addEventListener){
  	  this.addEventListener('mouseover', fncOver);
  	  this.addEventListener('mouseout', fncOut);
  	  return this;
    }
  },
  /*
  * method: css(item,value) 
  *	sets or gets css values for an object
  *	if value is not specified it will return
  *	the requested css value. can take arrays.
  *	NOTE: to work cross-browser keys must 
  *	be in quotes {"background":"val","color":"val"}
  *	also all values needing px must use px
  */
  css: function(item,value){
    if(typeof(item) === 'object') {
  	  return this.setStyle(item);
    } else if(typeof(item) === 'string') {
  	  if(typeof(value) != 'undefined') {
  	    return this.setStyle(item,value);
  	  } else {
  	    return this.getStyle(item);
  	  }
    }
  }
}

/*
* method inArray(array)
*    returns boolean
*/
function inArray(needle, haystack, argStrict) {
    var key = '', strict = !!argStrict;
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}

/*
* method cloneArray(array)
*    returns clone of original array
*/
function cloneArray(arry){
	return arry.slice(0,arry.length);
}
/*
* method urlEncode(array)
*    returns url-encoded string
*/
function urlEncode(str) {
    var output = '';
    var x = 0;
    clearString = str.toString();
    var regex = /(^[a-zA-Z0-9_.]*)/;
    while (x < clearString.length) {
      var match = regex.exec(clearString.substr(x));
      if (match != null && match.length > 1 && match[1] != '') {
      	output += match[1];
        x += match[1].length;
      } else {
        if (clearString[x] == ' ')
          output += '+';
        else {
          var charCode = clearString.charCodeAt(x);
          var hexVal = charCode.toString(16);
          output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
        }
        x++;
      }
    }
    return output;
}
/*
* method urlDecode(array)
*    returns url-decoded string
*/
function urlDecode (str) {
    var output = str;
    var binVal, thisString;
    var myregexp = /(%[^%]{2})/;
    while ((match = myregexp.exec(output)) != null
               && match.length > 1
               && match[1] != '') {
      binVal = parseInt(match[1].substr(1),16);
      thisString = String.fromCharCode(binVal);
      output = output.replace(match[1], thisString);
    }
    return output;
}

var JSON = {};
/*
* function JSON.stringify(object)
*    returns valid JSON String from object
*    modified from Theodor Zoulias's version:
*    http://trimpath.com/forum/viewtopic.php?id=217
*/
JSON.stringify = (function () {
  return function(o) {
    var UNDEFINED
    switch (typeof o) {
      case 'string': return '"' + encodeJS(o) + '"'
      case 'number': return String(o)
      case 'object': 
        if (o) {
          var a = []
          if (o.length) {
            for (var i = 0; i < o.length; i++) {
              var json = JSON.stringify(o[i])
              if (json != UNDEFINED) a[a.length] = json
            }
            return '[' + a.join(',') + ']'
          } else if (o.constructor == Date) {
            return 'new Date(' + o.getTime() + ')'
          } else {
            for (var p in o) {
              var json = JSON.stringify(o[p])
              if (json != UNDEFINED) a[a.length] = (/^[A-Za-z_]\w*$/.test(p) ? ('"'+ p + '":') : ('"' + encodeJS(p) + '":')) + json
            }
            return '{' + a.join(',') + '}'
          }
        }
        return 'null'
      case 'boolean'  : return String(o)
      case 'function' : return
      case 'undefined': return 'null'
    }
  }
  
  function encodeJS(s) {
    return (!/[\x00-\x19\'\\]/.test(s)) ? s : s.replace(/([\\'])/g, '\\$1').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/[\x00-\x19]/g, '')
  }
})();

/*
* JSON parser modified by: Nate McQuay for use with Facebook FBJS
* http://code.google.com/p/fbjqry/
* Original parser by: Mike Samuel
* Original code from: http://code.google.com/p/json-sans-eval/
* // Usage:
* JSON.parse(jsonString);
*/
JSON.parse = (function() {
var number  = '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
var string  = '(?:\"' + oneChar + '*\")';
var jsonToken = new RegExp('(?:false|true|null|[\\{\\}\\[\\]]' + '|' + number + '|' + string + ')', 'g');
var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');
var escapes = {
    '"': '"',
    '/': '/',
    '\\': '\\',
    'b': '\b',
    'f': '\f',
    'n': '\n',
    'r': '\r',
    't': '\t'
};
function unescapeOne(_, ch, hex) {
    return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
}
return function (json, opt_reviver) {
    var toks = json.match(jsonToken);
    var result;
    var tok = toks[0];
    if ('{' === tok) {
        result = {};
    } else if ('[' === tok) {
        result = [];
    } else {
        // console.error('unsupported initial json token: ' + tok);
    }
    var key;
    var stack = [result];
    for (var i = 1, n = toks.length; i < n; ++i) {
      tok = toks[i];

      var cont;
      switch (tok.charCodeAt(0)) {
        case 0x22:  // '"'
          tok = tok.substring(1, tok.length - 1);
          if (tok.indexOf('\\') !== -1) {
            tok = tok.replace(escapeSequence, unescapeOne);
          }
          cont = stack[0];
          if (!key) {
            if (cont instanceof Array) {
              key = cont.length;
            } else {
              key = tok || '';
              break;
            }
          }
          cont[key] = tok;
          key = 0;
          break;
        case 0x5b:  // '['
          cont = stack[0];
          stack.unshift(cont[key || cont.length] = []);
          key = 0;
          break;
        case 0x5d:  // ']'
          stack.shift();
          break;
        case 0x66:  // 'f'
          cont = stack[0];
          cont[key || cont.length] = false;
          key = 0;
          break;
        case 0x6e:  // 'n'
          cont = stack[0];
          cont[key || cont.length] = null;
          key = 0;
          break;
        case 0x74:  // 't'
          cont = stack[0];
          cont[key || cont.length] = true;
          key = 0;
          break;
        case 0x7b:  // '{'
          cont = stack[0];
          stack.unshift(cont[key || cont.length] = {});
          key = 0;
          break;
        case 0x7d:  // '}'
          stack.shift();
          break;
        default:  // sign or digit
          cont = stack[0];
          cont[key || cont.length] = +(tok);
          key = 0;
          break;
      }
    }
    if (stack.length) {
        // console.error('Could not fully process json object');
    }
    if (opt_reviver) {
      var walk = function (holder, key) {
        var value = holder[key];
        if (value && typeof value === 'object') {
          var toDelete = null;
          for (var k in value) {
            if (value.hasOwnProperty(k)) {
              var v = walk(value, k);
              if (v !== 0) {
                value[k] = v;
              } else {
                if (!toDelete) { toDelete = []; }
                toDelete.push(k);
              }
            }
          }
          if (toDelete) {
            for (var i = toDelete.length; --i >= 0;) {
              delete value[toDelete[i]];
            }
          }
        }
        return opt_reviver.call(holder, key, value);
      };
      result = walk({ '': result }, '');
    }
    return result;
  };
})();