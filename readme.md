feedback.js - Feedback form with screenshot
===========================================

wip... preview available at http://experiments.hertzen.com/jsfeedback/

This script allows you to create feedback forms which include a screenshot, created on the clients browser, along with the form. The screenshot is based on the DOM and as such may not be 100% accurate to the real representation as it does not make an actual screenshot, but builds the screenshot based on the information available on the page.

## How does it work? ##
The script is based on the <a href="http://html2canvas.hertzen.com/">html2canvas library</a>, which renders the current page as a canvas image, by reading the DOM and the different styles applied to the elements. This script adds the options for the user to draw elements on top of that image, such as mark points of interest on the image along with the feedback they send.

No plugins, no flash, no interaction needed from the server, just pure JavaScript!

## Building feedback.js ##
1. Install rake and uglifier at the command line if you don't already have it (uglifier is only needed if you are going to compile the minified version)
```bash
    gem install rake
    gem install uglifier
```

2. Navigate to the feedback.js directory in the terminal and run one of the following
```bash
    rake compile_unminified
    rake compile_minified
    rake compile_all
```

## Browser compatibility ##

 - Firefox 3.5+
 - Newer versions of Google Chrome, Safari & Opera
 - IE9

## License ##
 
feedback.js is released under the MIT license:

* http://www.opensource.org/licenses/MIT