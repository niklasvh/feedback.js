

window.Feedback.Screenshot = function( options ) {
    this.options = options || {};

    this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

    this.h2cDone = false;
};

window.Feedback.Screenshot.prototype = new window.Feedback.Page();

window.Feedback.Screenshot.prototype.end = function( modal ){
    modal.className = modal.className.replace(/feedback\-animate\-toside/, "");

    // remove event listeners
    document.body.removeEventListener("mousemove", this.mouseMoveEvent, false);
    document.body.removeEventListener("click", this.mouseClickEvent, false);

    removeElements( [this.h2cCanvas] );

    this.h2cDone = false;

};

window.Feedback.Screenshot.prototype.close = function(){
    removeElements( [ this.blackoutBox, this.highlightContainer, this.highlightBox, this.highlightClose ] );

    removeElements( document.getElementsByClassName( this.options.blackoutClass ) );
    removeElements( document.getElementsByClassName( this.options.highlightClass ) );

};

window.Feedback.Screenshot.prototype.start = function( modal, modalHeader, modalFooter, nextButton ) {

    if ( this.h2cDone ) {
        emptyElements( this.dom );
        nextButton.disabled = false;
        
        var $this = this,
        feedbackHighlightElement = "feedback-highlight-element",
        dataExclude = "data-exclude";

        var action = true;

        // delegate mouse move event for body
        this.mouseMoveEvent = function( e ) {

            // set close button
            if ( e.target !== previousElement && (e.target.className.indexOf( $this.options.blackoutClass ) !== -1 || e.target.className.indexOf( $this.options.highlightClass ) !== -1)) {

                var left = (parseInt(e.target.style.left, 10) +  parseInt(e.target.style.width, 10));
                left = Math.max( left, 10 );

                left = Math.min( left, window.innerWidth - 15 );

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
            if (e.target.nodeName === "BODY" ||  e.target === highlightClose || e.target === modal || e.target === nextButton || e.target.parentNode === modal || e.target.parentNode === modalHeader) {
                // we are not gonna blackout the whole page or the close item
                clearBox();
                previousElement = e.target;
                return;
            }

            hideClose();

            if (e.target !== previousElement ) {
                previousElement = e.target;

                window.clearTimeout( timer );

                timer = window.setTimeout(function(){
                    var bounds = getBounds( previousElement ),
                    item;

                    if ( action === false ) {
                        item = blackoutBox;
                    } else {
                        item = highlightBox;
                        item.width = bounds.width;
                        item.height = bounds.height;
                        ctx.drawImage($this.h2cCanvas, window.pageXOffset + bounds.left, window.pageYOffset + bounds.top, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height );
                    }

                    // we are only targetting IE>=9, so window.pageYOffset works fine
                    item.setAttribute(dataExclude, false);
                    item.style.left = window.pageXOffset + bounds.left + "px";
                    item.style.top = window.pageYOffset + bounds.top + "px";
                    item.style.width = bounds.width + "px";
                    item.style.height = bounds.height + "px";
                }, 100);



            }


        };


        // delegate event for body click
        this.mouseClickEvent = function( e ){

            e.preventDefault();


            if ( action === false) {
                if ( blackoutBox.getAttribute(dataExclude) === "false") {
                    var blackout = document.createElement("div");
                    blackout.className = $this.options.blackoutClass;
                    blackout.style.left = blackoutBox.style.left;
                    blackout.style.top = blackoutBox.style.top;
                    blackout.style.width = blackoutBox.style.width;
                    blackout.style.height = blackoutBox.style.height;

                    document.body.appendChild( blackout );
                    previousElement = undefined;
                }
            } else {
                if ( highlightBox.getAttribute(dataExclude) === "false") {

                    highlightBox.className += " " + $this.options.highlightClass;
                    highlightBox.className = highlightBox.className.replace(/feedback\-highlight\-element/g,"");
                    $this.highlightBox = highlightBox = document.createElement('canvas');

                    ctx = highlightBox.getContext("2d");

                    highlightBox.className += " " + feedbackHighlightElement;

                    document.body.appendChild( highlightBox );
                    clearBox();
                    previousElement = undefined;
                }
            }



        };

        this.highlightClose = element("div", "×");
        this.blackoutBox = document.createElement('div');
        this.highlightBox = document.createElement( "canvas" );
        this.highlightContainer = document.createElement('div');
        var timer,
        highlightClose = this.highlightClose,
        highlightBox = this.highlightBox,
        blackoutBox = this.blackoutBox,
        highlightContainer = this.highlightContainer,
        removeElement,
        ctx = highlightBox.getContext("2d"),
        buttonClickFunction = function( e ) {
            e.preventDefault();
            
            if (blackoutButton.className.indexOf("active") === -1) {
                blackoutButton.className += " active";
                highlightButton.className = highlightButton.className.replace(/active/g,"");
            } else {
                highlightButton.className += " active";
                blackoutButton.className = blackoutButton.className.replace(/active/g,"");
            }

            action = !action;
        },
        clearBox = function() {
            
            clearBoxEl(blackoutBox);
            clearBoxEl(highlightBox);

            window.clearTimeout( timer );
        },
        clearBoxEl = function( el ) {
            el.style.left =  "-5px";
            el.style.top =  "-5px";
            el.style.width = "0px";
            el.style.height = "0px";
            el.setAttribute(dataExclude, true);
        },
        hideClose = function() {
            highlightClose.style.left =  "-50px";
            highlightClose.style.top =  "-50px";

        },
        blackoutButton = element("a", "Blackout"),
        highlightButton = element("a", "Highlight"),
        previousElement;


        modal.className += ' feedback-animate-toside';


        highlightClose.id = "feedback-highlight-close";


        highlightClose.addEventListener("click", function(){
            removeElement.parentNode.removeChild( removeElement );
            hideClose();
        }, false);

        document.body.appendChild( highlightClose );


        this.h2cCanvas.className = 'feedback-canvas';
        document.body.appendChild( this.h2cCanvas);


        var buttonItem = [ highlightButton, blackoutButton ];

        this.dom.appendChild( element("p", "Highlight or blackout important information") );

        // add highlight and blackout buttons
        for (var i = 0; i < 2; i++ ) {
            buttonItem[ i ].className = 'feedback-btn feedback-btn-small ' + (i === 0 ? 'active' : 'feedback-btn-inverse');

            buttonItem[ i ].href = "#";
            buttonItem[ i ].onclick = buttonClickFunction;

            this.dom.appendChild( buttonItem[ i ] );

            this.dom.appendChild( document.createTextNode(" ") );

        }



        highlightContainer.id = "feedback-highlight-container";
        highlightContainer.style.width = this.h2cCanvas.width + "px";
        highlightContainer.style.height = this.h2cCanvas.height + "px";

        this.highlightBox.className += " " + feedbackHighlightElement;
        this.blackoutBox.id = "feedback-blackout-element";
        document.body.appendChild( this.highlightBox );
        highlightContainer.appendChild( this.blackoutBox );

        document.body.appendChild( highlightContainer );

        // bind mouse delegate events
        document.body.addEventListener("mousemove", this.mouseMoveEvent, false);
        document.body.addEventListener("click", this.mouseClickEvent, false);

    } else {
        // still loading html2canvas
        var args = arguments,
        $this = this;

        if ( nextButton.disabled !== true) {
            this.dom.appendChild( loader() );
        }

        nextButton.disabled = true;

        window.setTimeout(function(){
            $this.start.apply( $this, args );
        }, 500);
    }

};

window.Feedback.Screenshot.prototype.render = function() {

    this.dom = document.createElement("div");

    // execute the html2canvas script
    var script,
    $this = this,
    options = this.options,
    runH2c = function(){
        try {

            options.onrendered = options.onrendered || function( canvas ) {
                $this.h2cCanvas = canvas;
                $this.h2cDone = true;
            };

            window.html2canvas([ document.body ], options);

        } catch( e ) {

            $this.h2cDone = true;
            log("Error in html2canvas: " + e.message);
        }
    };

    if ( window.html2canvas === undefined && script === undefined ) {

        // let's load html2canvas library while user is writing message

        script = document.createElement("script");
        script.src = options.h2cPath || "libs/html2canvas.js";
        script.onerror = function() {
            log("Failed to load html2canvas library, check that the path is correctly defined");
        };

        script.onload = (scriptLoader)(script, function() {

            if (window.html2canvas === undefined) {
                log("Loaded html2canvas, but library not found");
                return;
            }

            window.html2canvas.logging = window.Feedback.debug;
            runH2c();


        });

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);

    } else {
        // html2canvas already loaded, just run it then
        runH2c();
    }

    return this;
};

window.Feedback.Screenshot.prototype.data = function() {

    if ( this._data !== undefined ) {
        return this._data;
    }

    if ( this.h2cCanvas !== undefined ) {
      
        var ctx = this.h2cCanvas.getContext("2d"),
        canvasCopy,
        copyCtx,
        radius = 5;
        ctx.fillStyle = "#000";

        // draw blackouts
        Array.prototype.slice.call( document.getElementsByClassName('feedback-blackedout'), 0).forEach( function( item ) {
            var bounds = getBounds( item );
            ctx.fillRect( bounds.left, bounds.top, bounds.width, bounds.height );
        });

        // draw highlights
        var items = Array.prototype.slice.call( document.getElementsByClassName('feedback-highlighted'), 0);

        if (items.length > 0 ) {

            // copy canvas
            canvasCopy = document.createElement( "canvas" );
            copyCtx = canvasCopy.getContext('2d');
            canvasCopy.width = this.h2cCanvas.width;
            canvasCopy.height = this.h2cCanvas.height;

            copyCtx.drawImage( this.h2cCanvas, 0, 0 );

            ctx.fillStyle = "#777";
            ctx.globalAlpha = 0.5;
            ctx.fillRect( 0, 0, this.h2cCanvas.width, this.h2cCanvas.height );

            ctx.beginPath();

            items.forEach( function( item ) {

                var x = parseInt(item.style.left, 10),
                y = parseInt(item.style.top, 10),
                width = parseInt(item.style.width, 10),
                height = parseInt(item.style.height, 10);

                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
               
            });
            ctx.closePath();
            ctx.clip();

            ctx.globalAlpha = 1;

            ctx.drawImage(canvasCopy, 0,0);
   
        }
        
        // to avoid security error break for tainted canvas   
        try {
            // cache and return data
            return ( this._data = this.h2cCanvas.toDataURL() );
        } catch( e ) {}
        
    }
};


window.Feedback.Screenshot.prototype.review = function( dom ) {
  
    var data = this.data();
    if ( data !== undefined ) {
        var img = new Image();
        img.src = data;
        img.style.width = "300px";
        dom.appendChild( img );
    }
    
};