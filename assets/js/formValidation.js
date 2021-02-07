var noErrors;

function checkRegExp(field, regExp) {
    if(field.val().match(regExp)) fieldCorrect(field);
    else fieldIncorrect(field);
}

function fieldCorrect(field) {
    $(field).addClass('borderYellow');
    $(field).removeClass('borderRed');
    $(field).next('.errorMessage').slideUp();
}

function fieldIncorrect(field) {
    $(field).addClass('borderRed');
    $(field).removeClass('borderYellow');
    $(field).next('.errorMessage').slideDown();
    noErrors = false;
}

function submitForm(checkFunctions, message, form) {
    noErrors = true;
    for(var f of checkFunctions) {
        f();
    }
    if(noErrors) {
        $('.successModal p').html(message);
        clearForm(form);
        openModal();
    }
}

function clearForm(form) {
    $(form).find('.textField').val('').removeClass('borderYellow');
}

function openModal() {
    $('.successModal').fadeIn('fast', function() {
        $('.modalContent').fadeIn('fast');
    });
}

function closeModal() {
    $('.modalContent').fadeOut('fast', function() {
        $('.successModal').fadeOut('fast');
    });
}

$(document).ready(function() {
    $('body').append('<div class="successModal"><div class="cover"><div class="modalContent"><p class="font-small"></p><button class="font-medium btnCloseModal">x</button></div></div></div>');
    $('.successModal, .modalContent').hide();

    $('.successModal .cover, .btnCloseModal').click(closeModal);
    $('.modalContent').click(function(e) {
        e.stopPropagation();
    });
});