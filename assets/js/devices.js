$(document).ready(function() {
    // CBECKBOX GROUPS
    loadJson('operatingSystems', function(output) {
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
        let html = '';
        if(data.length == 0) {
            html = '<p class="font-large">Oops. Seems like there are no items that match your search criteria.</p>';
        } else {
            let devicesPerPage = 6;
            let currentDevice = 0;
            let pageNumber = 1;
            for(let i in data) {
                currentDevice++;
                if(currentDevice > devicesPerPage) currentDevice = 1;
                // PAGE BEGINNING
                if(currentDevice == 1) {
                    html += `<div id='page${pageNumber}' class='page'>`;
                }
                // DEVICES
                html+= `<div class="device"><div class="deviceImage"><img src="assets/img/${data[i].image}" alt="${data[i].name}"/></div><div class="deviceText"><label class="font-medium deviceName">${data[i].name}</label><label class="font-medium devicePrice">${data[i].price}€</label><div class="textCenter"><button class="font-small btnPrimary btnAddToCart" data-id="${data[i].id}"><i class="fas fa-shopping-cart font-medium"></i>+</button></div></div></div>`;
                // PAGE END
                if(currentDevice == devicesPerPage || i == data.length - 1) {
                    html += "</div>";
                    pageNumber++;
                }
            }
            // PAGE NAVIGATION
            html += "<div id='paging'><ul class='font-small'><li><a href='#' class='btnPrimary prevPage'><</a></li>";
            for(let i = 1; i < pageNumber; i++) {
                html += `<li><a class='btnPrimary btnPage' data-page='${i}'>${i}</a></li>`;
            }
            html += "<li><a href='#' class='btnPrimary nextPage'>></a></li></ul></div>";
        }
        $('#devicesContainer').html(html);
		// ADD TO CART EVENT
        $('.btnAddToCart').click(function() {
            addToCart(this);
        });
		enablePaging();
    }

    // SEARCH
    function searchFilter(data) {
        try {
            data = data.filter(function(el) {
                if(el.name.toUpperCase().indexOf($('#tbSearch').val().trim().toUpperCase()) != -1) return el;
            });
            return data;
        } catch(ex) {
            console.error(ex.description);
        }
    }

    // SORT ORDER
    function sortOrderFilter(data) {
        let $ddlSortOrder = $('#ddlOrder');
        if($ddlSortOrder.prop('selectedIndex') != '0') {
            if($ddlSortOrder.val() == 'nameAZ') {
                data = sortFunction(data, 'name', false);
            } else if($ddlSortOrder.val() == 'nameZA') {
                data = sortFunction(data, 'name', true);
            } else if($ddlSortOrder.val() == 'priceASC') {
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
            if(a[attr] > b[attr]) return x;
            else if(a[attr] < b[attr]) return y;
            else return 0;
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
        let cartDevices = loadLocalStorage('cart');
        var deviceId = parseInt($(btn).data('id'));
        var isInCart = false;
        var index;
        for(let i in cartDevices) {
            if(deviceId == cartDevices[i].id) {
                index = i;
                isInCart = true;
                break;
            }
        }
        if(isInCart) {
            if(cartDevices[index].quantity < 10) {
                cartDevices[index].quantity++;
                updateLocalStorage(cartDevices, 'cart');
                successfullyAddedModal();
            }
            else cannotAddModal();
        } else {
            for(let i in devices) {
                if(devices[i].id == deviceId) {
                    index = i;
                    break;
                }
            }
            cartDevices.push({
                "id": devices[index].id,
                "name": devices[index].name,
                "price": devices[index].price,
                "quantity": 1
            });
            updateLocalStorage(cartDevices, 'cart');
            successfullyAddedModal();
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
	
	// PAGING
    var currentPage;
    enablePaging();

    function enablePaging() {
        currentPage = 1;
        $('.page:not(:first)').hide();
        $('.btnPage:first').addClass('activePage');
        $('.prevPage').addClass('disabled');
        if($('.page').length == 1) $('.nextPage').addClass('disabled');
        $('#paging a').click(function(e) {
            e.preventDefault();
            if(!$(this).hasClass('disabled')) {
                if($(this).hasClass('prevPage') || $(this).hasClass('nextPage')) {
                    if($(this).hasClass('prevPage')) {
                        if(currentPage > 1) currentPage--;
                    }
                    else if(currentPage < $('.page').length) currentPage++;
                    $('.page').hide();
                    $(`#page${currentPage}`).show();
                    $('.btnPage').removeClass('activePage').eq(currentPage - 1).addClass('activePage');
                } else {
                    let page = $(this).data('page');
                    $('.page').hide();
                    $(`#page${page}`).show();
                    $('.btnPage').removeClass('activePage');
                    $(this).addClass('activePage');
                    currentPage = page;
                }
                if(currentPage == 1) $('.prevPage').addClass('disabled');
                else $('.prevPage').removeClass('disabled');
                if(currentPage == $('.page').length) $('.nextPage').addClass('disabled');
                else $('.nextPage').removeClass('disabled');
            }
        });
    }
});