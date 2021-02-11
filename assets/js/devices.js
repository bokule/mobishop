$(document).ready(function() {
    // SORT ORDER
    loadJson('sortOrder', function(output) {
        fillSortOrderDdl(output);
    });
    
    var $ddlSortOrder = $('#ddlOrder');
    $ddlSortOrder.append('<option value="0">Sort Order</option>');

    function fillSortOrderDdl(data) {
        for(let el of data) {
            $ddlSortOrder.append(`<option value="${el.id}">${el.name}</option>`);
        }
    }

    // CBECKBOX GROUPS
    var operatingSystems;

    loadJson('operatingSystems', function(output) {
        operatingSystems = output;
        fillChbGroup('OS', output, 'chbOS');
    });

    var brands

    loadJson('brands', function(output) {
        brands = output;
        fillChbGroup('Brand', output, 'chbBrand');
    });

    function fillChbGroup(label, values, chbClass) {
        var $chbGroup = $(`<div class="formGroup"><label class="font-small">${label}:</label><div>`);
        for(let val of values) {
            $chbGroup.append(`<div class="checkboxGroup"><input type="checkbox" name="chb${val.name}" id="chb${val.name}" value="${val.id}" class="chb${label}"/><label for="chb${val.name}" class="font-small">${val.name}</label></div>`);
        }
        $('#chbGroups').append($chbGroup);
        $(`.${chbClass}`).change(function() {
            printDevices(devices);
        });
    }

    // PRICE RANGE
    function printPriceRangeValue() {
        $('#priceRange').html(`< ${$('#rnPrice').val()}€`);
    }

    printPriceRangeValue();

    $('#rnPrice').on('input', printPriceRangeValue);

    // DEVICES
    var devices;

    loadJson('devices', function(output) {
        devices = output;
        printDevices(output);
    });

    function printDevices(data) {
        // FILTERING
        data = searchFilter(data);
        data = sortOrderFilter(data);
        data = checkboxFiltering(data, $('.chbOS'), 'os');
        data = checkboxFiltering(data, $('.chbBrand'), 'brand');
        data = priceRangeFilter(data);

        // PRINTING
        $('#devicesContainer').html('');
        if(data.length == 0) {
            $('#devicesContainer').html('<p class="font-large">Oops. Seems like there are no items that match your search criteria.</p>')
        } else {
            for(let el of data) {
                $('#devicesContainer').append(`<div class="device"><div class="deviceImage"><img src="assets/img/${el.image}" alt="${el.name}"/></div><div class="deviceText"><h2 class="font-medium deviceName">${el.name}</h2><span class="font-medium">${el.price}€</span><div class="textCenter"><button class="font-small btnPrimary btnAddToCart"><i class="fas fa-shopping-cart font-medium"></i>+</button></div></div></div>`);
            }
            $('.btnAddToCart').click(function() {
                addToCart(this);
            });
        }
    }

    // SEARCH
    function searchFilter(data) {
        data = data.filter(function(el) {
            if(el.name.toUpperCase().indexOf($('#tbSearch').val().trim().toUpperCase()) != -1) return el;
        });
        return data;
    }

    // SORT ORDER
    function sortOrderFilter(data) {
        if($ddlSortOrder.prop('selectedIndex') != 0) {
            if($ddlSortOrder.val() == 1) {
                data = sortFunction(data, 'brand', false);
            } else if($ddlSortOrder.val() == 2) {
                data = sortFunction(data, 'brand', true);
            } else if($ddlSortOrder.val() == 3) {
                data = sortFunction(data, 'price', false);
            } else {
                data = sortFunction(data, 'price', true);
            }
        }
        return data;
    }

    function sortFunction(arr, attr, desc) {
        var x = 1;
        var y = -1;
        if(desc) {
            x = -1;
            y = 1;
        }
        arr.sort(function(a, b) {
            if(attr == 'brand') {
                for(let el of brands) {
                    if(a.brand == el.id) a = el.name;
                    if(b.brand == el.id) b = el.name;
                }
                if(a > b) return x;
                else if(a < b) return y;
                else return 0;
            } else {
                if(a[attr] > b[attr]) return x;
                else if(a[attr] < b[attr]) return y;
                else return 0;
            }
        });

        return arr;
    }

    // OS AND BRAND
    function checkboxFiltering(data, $chbGroup, attr) {
        var filteredValues = [];
        for(let el of $chbGroup) {
            if(el.checked) filteredValues.push(el.value);
        }
        if(filteredValues.length > 0) {
            data = data.filter(function(el) {
                for(let val of filteredValues) {
                    if(val == el[attr]) return el;
                }
            });
        }
        return data;
    }

    // PRICE RANGE
    function priceRangeFilter(data) {
        var maxPrice = $('#rnPrice').val();
        data = data.filter(function(el) {
            if(el.price <= maxPrice) return el;
        });
        return data;
    }

    // FILTERING

    $('#tbSearch').keyup(function() {
        printDevices(devices);
    });
    $('#ddlOrder, #rnPrice').change(function() {
        printDevices(devices);
    });

    // ADDING TO CART

    function addToCart(btn) {
        var deviceName = $(btn).parent().siblings('.deviceName').html();
        var isInCart = false;
        var index;
        for(let i in cartDevices) {
            if(deviceName == cartDevices[i].name) {
                index = i;
                isInCart = true;
                break;
            }
        }
        if(isInCart) {
            if(cartDevices[index].quantity < 10) {
                cartDevices[index].quantity++;
                updateLocalStorage();
                successfullyAddedModal()
            }
            else cannotAddModal();
        } else {
            for(let i in devices) {
                if(devices[i].name == deviceName) {
                    index = i;
                    break;
                }
            }
            cartDevices.push({
                "id": devices[index].id,
                "name": deviceName,
                "price": devices[index].price,
                "quantity": 1
            });
            updateLocalStorage();
            successfullyAddedModal()
        }
        printCartNumber();
    }

    function addToCartModal(modal) {
        $('body').append(modal);
        modal.hide();
        modal.fadeIn('fast');
        setTimeout(function() {
            modal.fadeOut('fast', function() {
                modal.remove();
            });
        }, 2000);
    }

    function successfullyAddedModal() {
        var modal = $('<div class="addToCartModal"><div class="addToCartModalContent"><p class="font-small">Item has been succesfully added to your cart.</p></div></div>');
        addToCartModal(modal);
    }

    function cannotAddModal() {
        var modal = $("<div class='addToCartModal'><div class='addToCartModalContent cannotAdd'><p class='font-small'>You can't have more than 10 of the same device in your cart.</p></div></div>");
        addToCartModal(modal);
    }
});