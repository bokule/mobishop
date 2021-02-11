$(document).ready(function() {
    // AUTHOR SOCIAL
    loadJson('authorSocialLinks', function(output) {
        printAuthorSocialLinks(output);
    });

    function printAuthorSocialLinks(data) {
        for(let el of data) {
            $('#authorSocial ul').append(`<li><a href="${el.href}" class="font-small" target="_blank"><i class="${el.icon}" style="color: ${el.color};"></i></a></li>`);
        }
    }
});