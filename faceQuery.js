// jQuery-like functions for ease of use
function $(id) {
	var that = document.getElementById(id);
	that.attr = function(item, value){
	    // if the value is not entered the function will get instead of set.
    	if(typeof(value) != 'undefined'){
            switch(item){
                case "class":
                return that.addClassName(value);
                break;
                case "src":
                return that.setSrc(value);
                break;
                case "id":
                return that.setId(value);
                break;
                case "title":
                return that.setTitle(value);
                break;
                case "name":
                return that.setName(value);
                break;
                case "xhtml":
                return that.setInnerXHTML(value);
                break;
            } 
        } else {
            switch(item){
                case "src":
                return that.getSrc(value);
                break;
                case "id":
                return that.getId(value);
                break;
                case "title":
                return that.getTitle(value);
                break;
                case "name":
                return that.getName(value);
                break;
            }
        }
    }
    that.xhtml = function(value){
        return that.setInnerXHTML(value);
    }
    that.append = function(element){
        return that.appendChild(element);
    }
    that.prepend = function(element){
        var thatParent = that.getParentNode();
        return thatParent.insertBefore(element,thatParent);
    }
    that.text = function(value){
        return that.setTextValue(value);
    }
	return that;
}