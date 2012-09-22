window.Feedback.Review = function() {

    this.dom = document.createElement("div");
    this.dom.className = "feedback-review";

};

window.Feedback.Review.prototype = new window.Feedback.Page();

window.Feedback.Review.prototype.render = function( pages ) {

    var i = 0, len = pages.length, item;
    emptyElements( this.dom );
    
    for (; i < len; i++) {
        
        // get preview DOM items
        pages[ i ].review( this.dom );

    }

    return this;

};

