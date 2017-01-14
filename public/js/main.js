$(document).ready(function() {
    $('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        columnWidth: 230
    });
});

function imgError(image) {
    image.onerror = "";
    image.src = "https://upload.wikimedia.org/wikipedia/commons/4/47/Comic_image_missing.png";
    $('.grid').masonry();
    return true;
}
