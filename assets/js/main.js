var cartDevices = [{
    "id": 1,
    "name": "Phone 1",
    "price": 140,
    "quantity": 1
},
{
    "id": 2,
    "name": "Phone 2",
    "price": 230,
    "quantity": 2
},
{
    "id": 3,
    "name": "Phone 3",
    "price": 190,
    "quantity": 1
}];

$(document).ready(function() {
    // NAV LINKS

    var pageLinks;

    $.ajax({
        url: "assets/json/pageLinks.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            pageLinks = data;
            printPageLinks();
        },
        error: function(errorMsg) {
            console.log(errorMsg);
        }
    });

    function printPageLinks() {
        for(let i in pageLinks) {
            $('#nav ul, #sideNavContent ul, #sitemap ul').append(`<li><a href="${pageLinks[i].href}" class="font-small">${pageLinks[i].name}</a></li>`);
        }
        addActiveClass();
    }

    // ACTIVE CLASS

    function addActiveClass() {
        var currentPage = location.pathname;
        console.log(currentPage);
        if(currentPage == '/') currentPage = '/index.html';
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

    var socialLinks;

    $.ajax({
        url: "assets/json/socialLinks.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            socialLinks = data;
            printSocialLinks();
        },
        error: function(errorMsg) {
            console.log(errorMsg);
        }
    });

    function printSocialLinks() {
        for(let i in socialLinks) {
            $('#social ul').append(`<li><a href="${socialLinks[i].href}" class="font-small" target="_blank"><i class="${socialLinks[i].icon}"></i><span class="socialText">${socialLinks[i].name}</span></a></li>`);
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

// CART NUMBER

function printCartNumber() {
    var numberOfDevices = 0;
    for(let i in cartDevices) {
        numberOfDevices += cartDevices[i].quantity;
    }
    $('#cartNumber').html(numberOfDevices);
}