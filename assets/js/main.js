// ERROR HANDLING
window.onerror = function(msg, url, line) {
    console.log(`Error: ${msg}`);
    console.log(`URL: ${url}`);
    console.log(`On line: ${line}`);
}

$(document).ready(function() {
    // NAV LINKS
    loadJson('pageLinks', function(output) {
        printPageLinks(output);
    });

    function printPageLinks(data) {
        for(let i in data) {
            $('#nav ul, #sideNavContent ul, #sitemap ul').append(`<li><a href="${data[i].href}" class="font-small">${data[i].name}</a></li>`);
        }
        addActiveClass();
    }

    // ACTIVE CLASS
    function addActiveClass() {
        var currentPage = location.pathname;
        var pageRegExp = /[(\.html)|(\.php)]$/;
        if(!currentPage.match(pageRegExp)) currentPage = '/index.html';
        currentPage = currentPage.substring(currentPage.lastIndexOf('/') + 1, currentPage.length);
        $('#nav ul li a, #sideNavContent ul li a').each(function() {
            $this = $(this);
            if($this.attr('href').indexOf(currentPage) != -1){
                $this.addClass('active');
                $this.click(function(e) {
                    e.preventDefault();
                });
            }
        });
    }

    // CART NUMBER
    printCartNumber();

    // SIDENAV
    $('#sideNav, #sideNavContent').hide();
    $('#hamburger a').click(function(e) {
        $('#sideNav').fadeIn('fast', function() {
            $('#sideNavContent').animate({'width' : 'show'},
            200);
        });
        e.preventDefault();
    });
    $('#sideNav .cover').click(function() {
        $('#sideNavContent').animate({'width' : 'hide'},
        200,
        function() {
            $('#sideNav').fadeOut('fast');
        });
    });
    $('#sideNavContent').click(function(e) {
        e.stopPropagation();
    });

    // SOCIAL
    loadJson('socialLinks', function(output) {
        printSocialLinks(output);
    });

    function printSocialLinks(data) {
        for(let i in data) {
            $('#social ul').append(`<li><a href="${data[i].href}" class="font-small" target="_blank"><i class="${data[i].icon}"></i><span class="socialText">${data[i].name}</span></a></li>`);
        }
    }

    // SCROLL TO TOP
    $('body').append('<a href="#" id="toTop"><span class="arrow"></span></div>');
    $('#toTop').click(function(e) {
        $(document).scrollTop(0);
        e.preventDefault();
    }).hide();
    $(document).scroll(function() {
        if($(this).scrollTop() >= 200) $('#toTop').fadeIn('fast');
        else $('#toTop').fadeOut('fast');
    });

    // FORM SUBMIT ON ENTER
    $('.textField').keydown(function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
        }
    });
});

// AJAX
function loadJson(fileName, func) {
    $.ajax({
        url: `assets/json/${fileName}.json`,
        method: "get",
        dataType: "json",
        success: func,
        error: function(errorMsg) {
            console.error(errorMsg);
        }
    });
}

// LOCAL STORAGE
function loadLocalStorage(data) {
    let cookie = [];
    if(localStorage.getItem(data) != null) {
        cookie = JSON.parse(localStorage.getItem(data));
    }
    return cookie;
}

function updateLocalStorage(data, cookie) {
    localStorage.setItem(cookie, JSON.stringify(data));
}

// CART NUMBER
function printCartNumber() {
    let cartDevices = loadLocalStorage('cart');
    var numberOfDevices = 0;
    for(let i in cartDevices) {
        numberOfDevices += cartDevices[i].quantity;
    }
    $('#cartNumber').html(numberOfDevices);
}