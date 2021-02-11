$(document).ready(function() {
    // TRANSPARENT HEADER
    if($(document).scrollTop() < $('#header').outerHeight()) $('#header').addClass('bgTransparent');

    $(document).scroll(function() {
        if($(document).scrollTop() > $('#header').outerHeight()) $('#header').removeClass('bgTransparent');
        else $('#header').addClass('bgTransparent');
    });

    // SLIDESHOW
    var sliderImages;

    loadJson('sliderImages', function(output) {
        sliderImages = output;
        printSliderImages(output);
    });

    function printSliderImages(data) {
        for(let i in data) {
            $('#slider').append($(`<div id="slide${i}" class="slide"></div>`).css('background-image', `url('assets/img/${data[i].image}.jpg')`));
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