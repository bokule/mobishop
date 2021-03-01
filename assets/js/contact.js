$(document).ready(function() {
    // FORM VALIDATION
    // NAME
    var regExpName = /^[A-ZŠĐČĆŽ][a-zšđčćž]{2,}(\s[A-ZŠĐČĆŽ][a-zšđčćž]{2,})*$/;
    var $tbName = $('#tbName');
    $tbName.blur(checkName);
    function checkName() {
        checkRegExp($tbName, regExpName);
    }

    // EMAIl
    var regExpEmail = /^[a-z][a-z0-9-_\.]{2,}@([a-z0-9-_]{2,}\.)+[a-z]{2,}$/;
    var $tbEmail = $('#tbEmail');
    $tbEmail.blur(checkEmail);
    function checkEmail() {
        checkRegExp($tbEmail, regExpEmail);
    }

    // MESSAGE
    var $tbMessage = $('#tbMessage');
    function checkMessage() {
        var numberOfSpaces = tbMessage.value.replace(/[^\s]/mg, "").length;
        if(tbMessage.value.length - numberOfSpaces < 20) {
            fieldIncorrect($tbMessage);
        } else {
            fieldCorrect($tbMessage);
        }
    }
    $tbMessage.blur(checkMessage);

    // FORM SUBMITION
    var checkFunctions = [checkName, checkEmail, checkMessage];
    var successMessage = 'Sent! Expect an answer from one of our agents soon.';
    $('#btnSend').click(function(e) {
        submitForm(checkFunctions, $('#contactForm form'), successMessage);
		e.preventDefault();
    });
});