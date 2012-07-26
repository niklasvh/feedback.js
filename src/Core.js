(function( win, undefined ){
      
    if ( win.Feedback !== undefined ) {
        return;
    }
    
    var log = function( msg ) {
        window.console.log( msg );
    },
    removeElements = function( remove ) {
        for (var i = 0, len = remove.length; i < len; i++ ) {
            var item = Array.prototype.pop.call( remove );
            if ( item !== undefined ) {
                item.parentNode.removeChild( item );
            }
        }
    },
    scriptLoader = function( script, func ){
                            
        if (script.onload === undefined) {
            // IE lack of support for script onload
                                
            if( script.onreadystatechange !== undefined ) {
                                    
                var intervalFunc = function() {
                    if (script.readyState !== "loaded" && script.readyState !== "complete") {
                        win.setTimeout( intervalFunc, 250 );
                    } else {
                        // it is loaded
                        func();
                    }
                                        
                                   
                };
                                    
                win.setTimeout( intervalFunc, 250 );

            } else {
                log("ERROR: We can't track when script is loaded");
            }
                                
        } else {
            return func;
        }
                            
    },
    h2cQueue,
    h2cCanvas,
    h2cDone = false,
    clickDone = false,
    fcAvailable,
    html2obj,
    canvasHolder,
    blackoutBox,
    highlightBox,
    highlightClose,
    nextButton,
    highlightContainer,
    h2cAvailable;
    
    win.Feedback = {
        /**
         * options
         * string h2cPath
         * string fcPath
         * string label - Button label text, default "Send Feedback"
         * string labelClass - Button class(es), default "btn bottom-right"
         * string closeClass - Close class(es), default "close"
         * string closeLabel
         * string modalClass
         * string modalHeader
         * string modalHeaderClass
         * string modalIntro
         * string buttonClass
         * Element appendTo - where to append button, default document.body
         */
        
        debug: true,
        log: log,
        
        init: function( options ) {
            var doc = win.document,
            body = doc.body,
            button,
            modal,
            glass = doc.createElement("div"),
            returnMethods = {
                // open send feedback modal window
                open: function() {
                    var modalHeader = doc.createElement("div"),
                    modalBody = doc.createElement("div"),
                    modalFooter = doc.createElement("div"),
                    script,
                    // user message
                    message = doc.createElement("textarea"),
                    
                    // Close button
                    a = doc.createElement("a");
                    
                    document.body.appendChild( glass );
                    
                    if ( win.html2canvas === undefined && script === undefined ) {
                        
                        // let's load html2canvas library while user is writing message
                     
                        script = doc.createElement("script");
                        script.src = options.h2cPath || "libs/html2canvas.js";
                        script.onerror = function() {
                            h2cAvailable = false;
                            log("Failed to load html2canvas library, check that the path is correctly defined");
                        };
                        
                        script.onload = (scriptLoader)(script, function() {
                           
                            if (win.html2canvas === undefined) {
                                log("Loaded html2canvas, but library not found"); 
                                h2cAvailable = false;
                                return;
                            }
                            
                            win.html2canvas.logging = win.Feedback.debug;
                            try {
                                
                                options.onrendered = options.onrendered || function( canvas ) {
                                    h2cCanvas = canvas;

                                    window.setTimeout(function(){
                                        h2cDone = true;
                                        nextFunc();
                                    }, 10000);
                                 
                                    
                                };
        
                                html2obj = win.html2canvas([ win.document.body ], options);
                                
                                
                            } catch( e ) {
                                
                                h2cDone = true;
                                nextFunc();
                                log("Error in html2canvas: " + e.message); 
                            }
                            
                            h2cAvailable = true;
                        });
                        
                        
                        
                        
                        button.parentNode.appendChild( script );
                    }
                    
                    a.className =  options.closeClass || "close";
                    a.onclick = returnMethods.close;
                    a.href = "#";
                    
                    button.disabled = true;
                    
                    a.appendChild( doc.createTextNode( options.closeLabel || "×" ) );
                    
                    modalHeader.appendChild( a );
                    modalHeader.appendChild( (function( h3 ){
                        h3.appendChild( doc.createTextNode(options.modalHeader || "Send Feedback") );
                        return h3;
                    })(doc.createElement("h3")) );
                    modalHeader.className =  "feedback-header";
                    
                    modalBody.className = "feedback-body";
                    
                    modalBody.appendChild( (function( p ){
                        p.appendChild(doc.createTextNode(options.modalIntro || "Please describe the issue you are experiencing"))
                        return p;
                    })(doc.createElement("p")) );
                    
                    modalBody.appendChild( message );
                    
                    
                    // Next button
                    nextButton = doc.createElement("button");
                    
                    nextButton.className =  options.buttonClass || "btn";
                    nextButton.onclick = function() {
                        clickDone = true;
                        
                        nextFunc();
                        
                        while ( modalBody.childNodes.length >= 1 ) {
                            modalBody.removeChild( modalBody.firstChild );       
                        } 
                           
                    };
                    
                    function nextFunc() {
                        
                        var progressBar,
                        action = "highlight";
                        
                        if ( clickDone ) {
                            nextButton.onclick = function() {};
                        }
                        
                        // canvas ready and user has entered message
                        if (h2cDone && clickDone) {   
                            
                            var timer,
                            removeElement,
                            ctx,
                            clearBox = function() {
                                blackoutBox.style.left =  "-5px";
                                blackoutBox.style.top =  "-5px";
                                blackoutBox.style.width = "0px"; 
                                blackoutBox.style.height = "0px";   
                                blackoutBox.setAttribute('data-exclude', true);
                                
                                
                                highlightBox.style.left =  "-5px";
                                highlightBox.style.top =  "-5px";
                                highlightBox.style.width = "0px"; 
                                highlightBox.style.height = "0px";  
                                highlightBox.setAttribute('data-exclude', true);
                                
                                win.clearTimeout( timer ); 
                            },
                            hideClose = function() {
                                highlightClose.style.left =  "-50px";
                                highlightClose.style.top =  "-50px";
 
                            },
                            previousElement;
                            
                            blackoutBox = document.createElement('div');
                            highlightBox = document.createElement('canvas');
                            
                            ctx = highlightBox.getContext("2d");
                           
                             
                            highlightClose = document.createElement('div');
                            highlightContainer = document.createElement('div');
                            
                            highlightClose.id = "feedback-highlight-close";
                            highlightClose.appendChild( document.createTextNode("×") );
                            
                            highlightClose.addEventListener("click", function(){
                                removeElement.parentNode.removeChild( removeElement );
                                hideClose();
                            }, false);
                            
                            document.body.appendChild( highlightClose );
                            
                            h2cCanvas.classList.add('feedback-canvas');

                            
                            document.body.appendChild( h2cCanvas);
                            
                            
                            highlightContainer.id = "feedback-highlight-container";
                            highlightContainer.style.width = h2cCanvas.width + "px";
                            highlightContainer.style.height = h2cCanvas.height + "px";
                            
                            highlightBox.classList.add("feedback-highlight-element");
                            blackoutBox.id = "feedback-blackout-element";
                            document.body.appendChild( highlightBox );
                            highlightContainer.appendChild( blackoutBox );
                            
                            document.body.appendChild( highlightContainer );
                            
                            document.body.addEventListener("mousemove", function(e) {
                                
                                // set close button
                                if ( e.target !== previousElement && (e.target.classList.contains("feedback-blackedout") || e.target.classList.contains("feedback-highlighted"))) {
                                    
                                    var left = (parseInt(e.target.style.left, 10) +  parseInt(e.target.style.width, 10));
                                    left = Math.max( left, 10 );
                                   
                                    var top = (parseInt(e.target.style.top, 10));
                                    top = Math.max( top, 10 );
                                    
                                    highlightClose.style.left = left + "px";
                                    highlightClose.style.top = top + "px";
                                    removeElement = e.target;
                                    clearBox();
                                    previousElement = undefined;
                                    return;
                                } 
                                
                                // don't do anything if we are highlighting a close button or body tag
                                if (e.target.nodeName === "BODY" ||  e.target.id === "feedback-highlight-close" ) {
                                    // we are not gonna blackout the whole page or the close item
                                    clearBox();
                                    previousElement = e.target;
                                    return;
                                }
                                
                                hideClose();
                                
                                if (e.target !== previousElement ) {
                                    previousElement = e.target;
                                    
                                    win.clearTimeout( timer ); 
                                    
                                    timer = win.setTimeout(function(){
                                        var bounds = previousElement.getBoundingClientRect(),
                                        item;
                                    
                                        if ( action === "blackout") {
                                            item = blackoutBox;
                                        } else {
                                            item = highlightBox;
                                            item.width = bounds.width;
                                            item.height = bounds.height;
                                            ctx.drawImage(h2cCanvas, win.pageXOffset + bounds.left, win.pageYOffset + bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                                        }
                                        
                                        // we are only targetting IE>=9, so window.pageYOffset works fine
                                        item.setAttribute('data-exclude', false);
                                        item.style.left = win.pageXOffset + bounds.left + "px";
                                        item.style.top = win.pageYOffset + bounds.top + "px";
                                        item.style.width = bounds.width + "px"; 
                                        item.style.height = bounds.height + "px";   
                                    }, 100);

                                    
                            
                                }
                                
                                
                            }, false);
                            
                            document.body.addEventListener("click", function( e ){
                                if (button.disabled === false) {
                                    return;
                                }
                                
                                e.preventDefault();
                             
                             
                                if ( action === "blackout") {
                                    if ( blackoutBox.getAttribute('data-exclude') === "false") {
                                        var blackout = document.createElement("div");
                                        blackout.classList.add('feedback-blackedout');
                                        blackout.style.left = blackoutBox.style.left;
                                        blackout.style.top = blackoutBox.style.top;
                                        blackout.style.width = blackoutBox.style.width;
                                        blackout.style.height = blackoutBox.style.height;
                                
                                        document.body.appendChild( blackout );
                                        previousElement = undefined;
                                    }
                                } else {
                                    if ( highlightBox.getAttribute('data-exclude') === "false") {
                                        
                                        highlightBox.classList.add('feedback-highlighted');
                                        highlightBox.classList.remove('feedback-highlight-element');
                                        highlightBox = document.createElement('canvas');
                            
                                        ctx = highlightBox.getContext("2d");
                                        
                                        highlightBox.classList.add("feedback-highlight-element");
                                        
                                        document.body.appendChild( highlightBox );
                                        clearBox();
                                        previousElement = undefined;
                                    }
                                }
                             

                                
                            }, false);
                            
                        } else if ( clickDone ) {
                           
                    }
                    }
                    
                    
                    
                    
                    nextButton.appendChild( doc.createTextNode( options.nextLabel || "Continue" ) );
                    
                    
                    modalFooter.className = "feedback-footer";
                    modalFooter.appendChild( nextButton );
                    
                    // modal container
                    modal = doc.createElement("div");
                    modal.className =  options.modalClass || "modal";
                    modal.setAttribute("data-html2canvas-ignore", true); // don't render in html2canvas
                    
                    modal.appendChild( modalHeader );
                    modal.appendChild( modalBody );
                    modal.appendChild( modalFooter );
                    
                    button.parentNode.appendChild( modal );
                },
                
                // close modal window
                close: function() {
                    
                    button.disabled = false;
                    
                    
                    // remove feedback elements

                    removeElements( [ modal, glass, blackoutBox, highlightBox, highlightClose, highlightContainer, h2cCanvas ] );
                    removeElements( document.getElementsByClassName('feedback-blackedout') );
                    removeElements( document.getElementsByClassName('feedback-highlighted') );

                    
                    
                    return false;
                    
                }
            };
            
            glass.classList.add("feedback-glass");
            glass.style.pointerEvents = "none";
            glass.setAttribute("data-html2canvas-ignore", true);
            
            options = options || {};
            
            button = doc.createElement( "button" );
            button.className = options.labelClass || "btn bottom-right";
            
            button.setAttribute("data-html2canvas-ignore", true);
            
            button.onclick = returnMethods.open;
            button.appendChild( doc.createTextNode( options.label || "Send Feedback" ) );
            ((options.appendTo !== undefined) ? options.appendTo : body).appendChild( button );
        }
        
    };
   
    
})( window );

