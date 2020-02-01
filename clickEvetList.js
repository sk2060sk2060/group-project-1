
$(document).on("click", ".choice" , function() {
  

    var title = $(this).data('title');
    var artist = $(this).data('artist')
     
    var musixMatchQuery = `${artist} - ${title}`;
    $("#curator-title").text(title);
    $("#curator-artist").text(artist);

    getLyricsAndDisplay(musixMatchQuery);
});