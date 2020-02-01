
$(document).on("click", ".choice" , function() {
  

    var title = $(this).data('title');
    var artist = $(this).data('artist')
     
    var musixMatchQuery = `${artist} - ${title}`;

    $("#curator-title").html(`<div class="curator_title_wrapper"><span>LP</span>
     <div class="curator_line"></div>
     <div class="info"></div>
     <div class="playback_info"></div>
     <div class="title">${title}</div>
     <div class="artist">${artist}</div>
     <div class="curator_line"></div><span>20</span>
     </div>`);

    getLyricsAndDisplay(musixMatchQuery);
});