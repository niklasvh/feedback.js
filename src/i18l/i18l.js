/*
  This allows custom messages and languages in the feedback.js library.
  The presidence order for messages is: Custom Message -> i18l -> defaults
  --------------------
  -Change Language: Include or create a language file. See examples at src/i18n/
  -Change Messages: Include or create a custom_message_strings override file
  
  Example:
    custom_message_strings.header         = "Please, send us your thoughts";
    custom_message_strings.messageSuccess = "Woah, we succeeded!";
*/

// Message getter function
function _(s) {
  if (typeof(custom_message_strings[s]) {
    return custom_message_strings[s];
  }
  return s;
}

// Define message inheritnace
var custom_message_strings = Object.create(i18n);
var i18l = Object.create(default_message_strings);
var default_message_strings = { label:          "Send Feedback"
                              , header:         "Send Feedback"
                              , nextLabel:      "Continue"
                              , reviewLabel:    "Review"
                              , sendLabel:      "Send"
                              , closeLabel:     "Close"
                                
                              , messageSuccess: "Your feedback was sent succesfully."
                              , messageError:   "There was an error sending your feedback to the server."
                              };