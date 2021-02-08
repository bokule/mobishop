$(document).ready(function() {
    // CART LIST

    for(let i in cartDevices) {
        var currentDevice = cartDevices[i];
        $('#cartList tbody').append(`<tr><td class="colDeviceName">${currentDevice.name}</td><td class="colPrice">${currentDevice.price}€</td><td class="colQuantity"><button class="btnPrimary btnQuantity btnDecrease"><span>-</span></button><span class="quantity">${currentDevice.quantity}</span><button class="btnPrimary btnQuantity btnIncrease"><span>+</span></button></td><td class="colRemove"><button class="btnRemove"><i class="fas fa-minus"></i></button></td></tr>`);
    }

    // BUTTON QUANTITY

    $('.btnQuantity').click(function() {
        var deviceName = $(this).parent().siblings('.colDeviceName').html();
        var index;
        for(let i in cartDevices) {
            if(deviceName == cartDevices[i].name) {
                index = i;
                break;
            }
        }
        if($(this).hasClass('btnIncrease')) {
            if(cartDevices[index].quantity < 10) {
                cartDevices[index].quantity++;
                updateLocalStorage();
            }
        } else {
            if(cartDevices[index].quantity > 1) {
                cartDevices[index].quantity--;
                updateLocalStorage();
            }
        }
        $(this).siblings('.quantity').html(cartDevices[index].quantity);
        printCartNumber();
        printTotalPrice();
    });

    // BUTTON REMOVE

    $('.btnRemove').click(function() {
        var currentDeviceName = $(this).parent().siblings('.colDeviceName').html();
        for(let i in cartDevices) {
            if(cartDevices[i].name == currentDeviceName) {
                removeDevice(i);
                break;
            }
        }
        printCartNumber();
        printTotalPrice();
        $(this).parents('tr').remove();
    });

    function removeDevice(index) {
        cartDevices.splice(index, 1);
        updateLocalStorage();
    }

    // TOTAL PRICE

    var totalPrice;
    function printTotalPrice() {
        totalPrice = 0;
        for(let i in cartDevices) totalPrice += cartDevices[i].price * cartDevices[i].quantity;
        $('#totalPrice').html(`Total Price: <span class="bold">${totalPrice}€</span>`);
    }

    printTotalPrice();

    // FORM VALIDATION

    // NAME

    var regExpName = /^[A-ZŠĐČĆŽ][a-zšđčćž]{2,}(\s[A-ZŠĐČĆŽ][a-zšđčćž]{2,})+$/;
    var $tbName = $('#tbName');
    $tbName.blur(checkName);
    function checkName() {
        checkRegExp($tbName, regExpName);
    }

    // EMAIL

    var regExpEmail = /^[a-z-_\.]+@([\w-_]{2,}\.)+[a-z]{2,}$/;
    var $tbEmail = $('#tbEmail');
    $tbEmail.blur(checkEmail);
    function checkEmail() {
        checkRegExp($tbEmail, regExpEmail);
    }

    // ADDRESS

    var regExpAddress = /^[A-ZŠĐČĆŽ][a-zšđčćž]{2,}(\s[A-ZŠĐČĆŽa-zšđčćž][a-zšđčćž]{2,})*\s\d+[A-Z]?(\/\d+)*$/;
    var $tbAddress = $('#tbAddress');
    $tbAddress.blur(checkAddress);
    function checkAddress() {
        checkRegExp($tbAddress, regExpAddress);
    }

    // CHECKOUT BUTTON

    var checkFunctions = [checkName, checkEmail, checkAddress];
    var successMessage = 'Success! We will reach out to you in the next couple of days to confirm the provided information.';
    $('#btnCheckout').click(function() {
        submitForm(checkFunctions, successMessage, $('#checkout form'));
        if(noErrors) emptyCart();
        return false;
    });

    function emptyCart() {
        cartDevices = [];
        updateLocalStorage();
        $('#cartList tbody').html('');
        printTotalPrice();
        printCartNumber();
    }
});