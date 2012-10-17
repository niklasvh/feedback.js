if ( window.Feedback !== undefined ) { 
    return; 
}

// log proxy function
var log = function( msg ) {
    window.console.log( msg );
},
// function to remove elements, input as arrays
removeElements = function( remove ) {
    for (var i = 0, len = remove.length; i < len; i++ ) {
        var item = Array.prototype.pop.call( remove );
        if ( item !== undefined ) {
            if (item.parentNode !== null ) { // check that the item was actually added to DOM
                item.parentNode.removeChild( item );
            }
        }
    }
},
loader = function() {
    var div = document.createElement("div"), i = 3;
    div.className = "feedback-loader";
    
    while (i--) { div.appendChild( document.createElement( "span" )); }
    return div;
},
getBounds = function( el ) {
    return el.getBoundingClientRect();
},
emptyElements = function( el ) {
    var item;
    while( (( item = el.firstChild ) !== null ? el.removeChild( item ) : false) ) {}
},
element = function( name, text ) {
    var el = document.createElement( name );
    el.appendChild( document.createTextNode( text ) );
    return el;
},
// script onload function to provide support for IE as well
scriptLoader = function( script, func ){

    if (script.onload === undefined) {
        // IE lack of support for script onload

        if( script.onreadystatechange !== undefined ) {

            var intervalFunc = function() {
                if (script.readyState !== "loaded" && script.readyState !== "complete") {
                    window.setTimeout( intervalFunc, 250 );
                } else {
                    // it is loaded
                    func();
                }
            };

            window.setTimeout( intervalFunc, 250 );

        } else {
            log("ERROR: We can't track when script is loaded");
        }

    } else {
        return func;
    }

},
nextButton,
H2C_IGNORE = "data-html2canvas-ignore",
currentPage,
modalBody = document.createElement("div");

window.Feedback = function( options ) {

    options = options || {};

    // default properties
    options.label = options.label || "Send Feedback";
    options.header = options.header || "Send Feedback";
    options.url = options.url || "/";
    options.adapter = options.adapter || new window.Feedback.XHR( options.url );
    
    options.nextLabel = options.nextLabel || "Continue";
    options.reviewLabel = options.reviewLabel || "Review";
    options.sendLabel = options.sendLabel || "Send";
    options.closeLabel = options.closeLabel || "Close";
    
    options.messageSuccess = options.messageSuccess || "Your feedback was sent successfully.";
    options.messageError = options.messageError || "There was an error sending your feedback to the server.";
    
  
    if (options.pages === undefined ) {
        options.pages = [
            new window.Feedback.Form(),
            new window.Feedback.Screenshot( options ),
            new window.Feedback.Review()
        ];
    }

    var button,
    modal,
    currentPage,
    glass = document.createElement("div"),
    returnMethods = {

        // open send feedback modal window
        open: function() {
            var len = options.pages.length;
            currentPage = 0;
            for (; currentPage < len; currentPage++) {
                // create DOM for each page in the wizard
                if ( !(options.pages[ currentPage ] instanceof window.Feedback.Review) ) {
                    options.pages[ currentPage ].render();
                }
            }

            var a = element("a", "×"),
            modalHeader = document.createElement("div"),
            // modal container
            modalFooter = document.createElement("div");

            modal = document.createElement("div");
            document.body.appendChild( glass );

            // modal close button
            a.className =  "feedback-close";
            a.onclick = returnMethods.close;
            a.href = "#";

            button.disabled = true;

            // build header element
            modalHeader.appendChild( a );
            modalHeader.appendChild( element("h3", options.header ) );
            modalHeader.className =  "feedback-header";

            modalBody.className = "feedback-body";

            emptyElements( modalBody );
            currentPage = 0;
            modalBody.appendChild( options.pages[ currentPage++ ].dom );


            // Next button
            nextButton = element( "button", options.nextLabel );

            nextButton.className =  "feedback-btn";
            nextButton.onclick = function() {
                
                if (currentPage > 0 ) {
                    if ( options.pages[ currentPage - 1 ].end( modal ) === false ) {
                        // page failed validation, cancel onclick
                        return;
                    }
                }
                
                emptyElements( modalBody );

                if ( currentPage === len ) {
                    returnMethods.send( options.adapter );
                } else {

                    options.pages[ currentPage ].start( modal, modalHeader, modalFooter, nextButton );
                    
                    if ( options.pages[ currentPage ] instanceof window.Feedback.Review ) {
                        // create DOM for review page, based on collected data
                        options.pages[ currentPage ].render( options.pages );
                    }
                    
                    // add page DOM to modal
                    modalBody.appendChild( options.pages[ currentPage++ ].dom );

                    // if last page, change button label to send
                    if ( currentPage === len ) {
                        nextButton.firstChild.nodeValue = options.sendLabel;
                    }
                    
                    // if next page is review page, change button label
                    if ( options.pages[ currentPage ] instanceof window.Feedback.Review ) {   
                        nextButton.firstChild.nodeValue = options.reviewLabel;
                    }
                        

                }

            };

            modalFooter.className = "feedback-footer";
            modalFooter.appendChild( nextButton );


            modal.className =  "feedback-modal";
            modal.setAttribute(H2C_IGNORE, true); // don't render in html2canvas


            modal.appendChild( modalHeader );
            modal.appendChild( modalBody );
            modal.appendChild( modalFooter );

            document.body.appendChild( modal );
        },


        // close modal window
        close: function() {

            button.disabled = false;

            // remove feedback elements
            removeElements( [ modal, glass ] );

            // call end event for current page
            if (currentPage > 0 ) {
                options.pages[ currentPage - 1 ].end( modal );
            }
                
            // call close events for all pages    
            for (var i = 0, len = options.pages.length; i < len; i++) {
                options.pages[ i ].close();
            }

            return false;

        },
        
        // send data
        send: function( adapter ) {
            
            // make sure send adapter is of right prototype
            if ( !(adapter instanceof window.Feedback.Send) ) {
                throw new Error( "Adapter is not an instance of Feedback.Send" );
            }
            
            // fetch data from all pages   
            for (var i = 0, len = options.pages.length, data = [], p = 0, tmp; i < len; i++) {
                if ( (tmp = options.pages[ i ].data()) !== false ) {
                    data[ p++ ] = tmp;
                }
            }

            nextButton.disabled = true;
                
            emptyElements( modalBody );
            modalBody.appendChild( loader() );

            // send data to adapter for processing
            adapter.send( data, function( success ) {
                
                emptyElements( modalBody );
                nextButton.disabled = false;
                
                nextButton.firstChild.nodeValue = options.closeLabel;
                
                nextButton.onclick = function() {
                    returnMethods.close();
                    return false;  
                };
                
                if ( success === true ) {
                    modalBody.appendChild( document.createTextNode( options.messageSuccess ) );
                } else {
                    modalBody.appendChild( document.createTextNode( options.messageError ) );
                }
                
            } );
  
        }
    };

    glass.className = "feedback-glass";
    glass.style.pointerEvents = "none";
    glass.setAttribute(H2C_IGNORE, true);

    options = options || {};

    button = element( "button", options.label );
    button.className = "feedback-btn feedback-bottom-right";

    button.setAttribute(H2C_IGNORE, true);

    button.onclick = returnMethods.open;
    
    if ( options.appendTo !== null ) {
        ((options.appendTo !== undefined) ? options.appendTo : document.body).appendChild( button );
    }
    
    return returnMethods;
};