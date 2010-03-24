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
    this.setStyle({
        display:'none'
    });
    return this;
  },
  show: function() {
    this.setStyle({
        display:'block'
    });
    return this;	
  },
  fadeToggle: function(){
    if (this.visible()) {
        this.fadeOut();
    } else {		
        this.fadeIn();
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
  },
  slideToggle: function(){
    if (this.visible()) {
        this.slideUp();
    } else {		
        this.slideDown();
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
  },
  remove: function() {
    this.getParentNode().removeChild(this);
    return null;
  },
  empty: function() {
    while (this.getFirstChild()) {
	this.removeChild(this.getFirstChild());
    }
    return null;
  },
  /*
   * Returns calculated element size
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
    //setInnerXHTML will fail unless you make sure `value` has one root container
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
  * method: val(value)
  *    set or get value of oject.
  */
  val: function(value){
    if(typeof(value) != 'undefined') {
      return this.setValue(value);
    } else {
      return this.getValue(value);
    }
  },
  /*
  * 
  */
  append: function(element){
    return this.appendChild(element);
  },
  /*
  * 
  */
  prepend: function(element){
    var thatParent = this.getParentNode();
    return thatParent.insertBefore(element,thatParent);
  },
  /*
  * 
  */
  text: function(value){
   return this.setTextValue(value);
  },
  /*
  * 
  */
  click: function(fnc){
    if(this.attachEvent){
  	  return this.attachEvent('onclick', fnc);
    } else if(this.addEventListener){
  	  return this.addEventListener('click', fnc, false);
    }
  },
  hover: function(fncOver,fncOut){
    if(this.attachEvent){
  	  this.attachEvent('mouseover', fncOver);
  	  this.attachEvent('mouseout', fncOut);
  	  return this;
    } else if(this.addEventListener){
  	  this.addEventListener('mouseover', fncOver);
  	  this.addEventListener('mouseout', fncOut);
    }
  },
  css: function(item,value){
    if(typeof(item) === 'object') {
  	  for(var attr in item){
  	    this.setStyle(attr,item[attr]);
  	  }
    } else if(typeof(item) === 'string') {
  	  if(typeof(value) != 'undefined') {
  	    return this.setStyle(item,value);
  	  } else {
  	    return this.getStyle(item);
  	  }
    }
  }
}