$(document).ready(function() {
    // AUTHOR SOCIAL

    var authorSocialLinks;

    $.ajax({
        url: "assets/json/authorSocialLinks.json",
        method: "get",
        dataType: "json",
        success: function(data) {
            authorSocialLinks = data;
            printAuthorSocialLinks();
        },
        error: function(errorMsg) {
            console.log(errorMsg);
        }
    });

    function printAuthorSocialLinks() {
        for(let el of authorSocialLinks) {
            $('#authorSocial ul').append(`<li><a href="${el.href}" class="font-small" target="_blank"><i class="${el.icon}" style="color: ${el.color};"></i></a></li>`);
        }
    }
});