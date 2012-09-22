window.Feedback.XHR = function( options ) {
    
    this.xhr = new XMLHttpRequest();
    this.url = options.url || "/";

};

window.Feedback.XHR.prototype = new window.Feedback.Send();

window.Feedback.XHR.prototype.send = function( data, callback ) {
    
    var xhr = this.xhr;
    
    xhr.onreadystatechange = function() {
        if( xhr.readyState == 4 ){
            callback( (xhr.status === 200) );
        }
    };
    
    xhr.open( "POST", this.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send( "data=" + encodeURIComponent( JSON.stringify( data ) ) );
     
};