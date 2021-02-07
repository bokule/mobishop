$(document).ready(function() {
    // TRANSPARENT HEADER

    $('#header').addClass('bgTransparent');

    $(document).scroll(function() {
        if($(document).scrollTop() > $('#header').outerHeight()) $('#header').removeClass('bgTransparent');
        else $('#header').addClass('bgTransparent');
    });

    // SLIDESHOW

    var sliderImages;

    $.ajax({
        url: "assets/json/sliderImages.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            sliderImages = data;
            printSliderImages();
        },
        error: function(errorMsg) {
            console.log(errorMsg);
        }
    });

    function printSliderImages() {
        for(let i in sliderImages) {
            $('#slider').append($(`<div id="slide${i}" class="slide"></div>`).css('background-image', `url('assets/img/${sliderImages[i].image}.jpg')`));
        }
        $('.slide:not(:first)').hide();
        setInterval(changeSlide, sliderInterval);
    }    

    var currentSlide = 0;
    var previousSlide;
    var sliderInterval = 5000;
    function changeSlide() {
        previousSlide = currentSlide;
        currentSlide++;
        if(currentSlide >= sliderImages.length) currentSlide = 0;
        $('.slide').eq(currentSlide).css('z-index', '-1').fadeIn(function() {
            $('.slide').eq(previousSlide).hide();
        });
        $('.slide').eq(previousSlide).css('z-index', '-2');
    }
});