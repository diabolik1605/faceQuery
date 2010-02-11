/*
 * faceQuery is a `jQuery-like` FBJS Wrapper
 */
function $(selector) {
	// Is the selector an object or string?
	if (typeof selector === "object") {
	    var that = selector;
	} else if (typeof selector === "string") {
		/*
		 * What type of selector are we dealing with?
		 *    "#" : get element by id
		 *    @todo: add more selector types, including selectors that return aggregates
		 */
		var selectorIdent = selector.charAt(0);		 
		switch(selectorIdent){
		    case "#":
		    	var id = selector.substring(1);
		    	var that = document.getElementById(id);
		    	break;
		    default:
		    	var that = document.getElementById(selector);
		    	break;
		}
	}

	/* 
	 * method: attr(item,[value])
	 *    gets or sets the following attributes
	 *    - class, src, id, title, name
	 *    if item is an object it loops through
	 *    NOTE: object only works in FF/Chrome, doesnt work in IE/Safari
	 */
	that.attr = function(item, value) {
		if(typeof(item) === 'object') {
			for(var attr in item){
				if (item.hasOwnProperty(attr)) {
					if(attr = "class") { return that.addClassName(item[attr]); } 
					else if(attr = "src") { return that.setSrc(item[attr]); } 
					else if(attr = "id") { return that.setId(item[attr]); } 
					else if(attr = "title") { return that.setTitle(item[attr]); } 
					else if(attr = "name") { return that.setName(item[attr]); }
				}
			}
		} else if(typeof(item) === 'string') {
			if(typeof(value) != 'undefined') {
				switch(item) {
					case "class": return that.addClassName(value); break;
					case "src": return that.setSrc(value); break;
					case "id": return that.setId(value); break;
					case "title": return that.setTitle(value); break;
					case "name": return that.setName(value); break;
				} 
			} else {
				switch(item) {
					case "src": return that.getSrc(value); break;
					case "id": return that.getId(value); break;
					case "title": return that.getTitle(value); break;
					case "name": return that.getName(value); break;
				}
			}   
		}
	}
	
	/* 
	 * method: xhtml(value)
	 *    sets inner xhtml for an object.
	 */	
	 that.xhtml = function(value) {
		 //setInnerXHTML will fail unless you make sure `value` has one root container
		 return that.setInnerXHTML('<span>' + value + '</span>');
	 }
    
	/*
	 * method: html(value)
	 *    alias for xhtml
	 */	    
	 that.html = that.xhtml;
    
	/* 
	 * method: fbml(value)
	 *    set inner fbml for an object.
	 *    value must be an fb:js-string variable, or
	 *    data returned from an FBJS Ajax call with
	 *    dataType set to Ajax.FBML
	 */	        
	 that.fbml = function(value){
		 return that.setInnerFBML(value);
	 }
	 
	 /*
	  * 
	  */
	 that.append = function(element){
		 return that.appendChild(element);
	 }
	 
	 /*
	  * 
	  */
	  that.prepend = function(element){
		  var thatParent = that.getParentNode();
		  return thatParent.insertBefore(element,thatParent);
	  }
	 
	 /*
	  * 
	  */
	  that.hide = function(value, easetype){
		  // if value is defined a duration in milliseconds is added
		  if(typeof(value) != 'undefined'){
			  // Facebook Builtin Animation Ease Types: 
			  // Animation.ease.begin - Animation.ease.end - Animation.ease.both
			  if (typeof(easetype) != 'undefined'){
				  Animation(that).to('opacity', 0).from(1).hide().duration(value).ease(easetype).go();
			  } else {
				  Animation(that).to('opacity', 0).from(1).hide().duration(value).go();
			  }
		  } else {
			  Animation(that).to('opacity', 0).from(1).hide().go();
		  }
	  }
	 
	 /*
	  * 
	  */
	  that.show = function(value, easetype){
		  // if value is defined a duration in milliseconds is added
		  if(typeof(value) != 'undefined'){
			  // Facebook Builtin Animation Ease Types: 
			  // Animation.ease.begin - Animation.ease.end - Animation.ease.both
			  if (typeof(easetype) != 'undefined'){
				  Animation(that).to('opacity', 1).from(0).show().duration(value).ease(easetype).go();
			  } else {
				  Animation(that).to('opacity', 1).from(0).show().duration(value).go();
			  }
		  } else {
			  Animation(that).to('opacity', 1).from(0).show().go();
		  }
	  }
    
    /*
     * 
     */
     that.text = function(value){
    	 return that.setTextValue(value);
     }
     
     /*
      * 
      */
      that.click = function(fnc){
    	  if(that.attachEvent){
    		  return that.attachEvent('onclick', fnc);
    	  } else if(that.addEventListener){
    		  return that.addEventListener('click', fnc, false);
    	  }
      }
      
      return that;
}
