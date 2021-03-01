$(document).ready(function() {
    // CART LIST
    function printCartDevices() {
        let cartDevices = loadLocalStorage('cart');
        $('#cartList tbody').html('');
        for(let i in cartDevices) {
            var currentDevice = cartDevices[i];
            $('#cartList tbody').append(`<tr data-id="${currentDevice.id}" class="cartItem"><td class="colDeviceName">${currentDevice.name}</td><td class="colPrice">${currentDevice.price}€</td><td class="colQuantity"><button class="btnPrimary btnQuantity btnDecrease"><span>-</span></button><span class="quantity">${currentDevice.quantity}</span><button class="btnPrimary btnQuantity btnIncrease"><span>+</span></button></td><td class="colRemove"><button class="btnRemove"><i class="fas fa-minus"></i></button></td></tr>`);
        }
    }
    
    printCartDevices();

    // BUTTON QUANTITY
    $('.btnQuantity').click(function() {
        let cartDevices = loadLocalStorage('cart');
        var deviceId = parseInt($(this).parents('tr').data('id'));
        var index;
        for(let i in cartDevices) {
            if(deviceId == cartDevices[i].id) {
                index = i;
                break;
            }
        }
        if($(this).hasClass('btnIncrease')) {
            if(cartDevices[index].quantity < 10) {
                cartDevices[index].quantity++;
                updateLocalStorage(cartDevices, 'cart');
            }
        } else {
            if(cartDevices[index].quantity > 1) {
                cartDevices[index].quantity--;
                updateLocalStorage(cartDevices, 'cart');
            }
        }
        $(this).siblings('.quantity').html(cartDevices[index].quantity);
        printCartNumber();
        printTotalPrice();
    });

    // BUTTON REMOVE
    $('.btnRemove').click(function() {
        let cartDevices = loadLocalStorage('cart');
        var deviceId = parseInt($(this).parents('tr').data('id'));
        for(let i in cartDevices) {
            if(cartDevices[i].id == deviceId) {
                removeDevice(i);
                break;
            }
        }
        printCartNumber();
        printTotalPrice();
        $(this).parents('tr').remove();
    });

    function removeDevice(index) {
        let cartDevices = loadLocalStorage('cart');
        cartDevices.splice(index, 1);
        updateLocalStorage(cartDevices, 'cart');
    }

    // TOTAL PRICE
    var totalPrice;
    function printTotalPrice() {
        let cartDevices = loadLocalStorage('cart');
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
    var regExpEmail = /^[a-z][a-z0-9-_\.]{2,}@([a-z0-9-_]{2,}\.)+[a-z]{2,}$/;
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
        if($('.cartItem').length != 0) {
            submitForm(checkFunctions, $('#checkout form'), successMessage);
            if(noErrors) emptyCart();
        } else openModal('Your cart is empty!');
    });

    function emptyCart() {
        updateLocalStorage([], 'cart');
        printCartDevices();
        printTotalPrice();
        printCartNumber();
    }
});