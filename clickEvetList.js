
$(document).on("click", ".choice" , function() {
  

    // var title = $(this).data('title');
    // var artist = $(this).data('artist')

    var title = $(this).find(".title").text();
    var artist = $(this).find(".artist").text();
    
    // var musixMatchQuery = `${artist} - ${title}`;
    var musixMatchQuery = {"artist": artist, "title": title};
    $("#curator-title").text(title);
    $("#curator-artist").text(artist);

     $("#player").hide('slow')
     var homeToMain = new TimelineMax({});
	
     // Hide
     $('.logo-text').css('display', 'none'),
     homeToMain.to($('.line, .text-wrap'), 0.5, {display: 'none', opacity: 0, y: -20, ease: Power2.easeInOut}, 0),
     
     // Background down
     homeToMain.to($('.wave-container'), 1, {yPercent: 30, ease: Power2.easeInOut}, 0),
         
     // Show
     $('#curator').css('display', 'block'),
     homeToMain.fromTo($('.back_btn'), 0.8, {x: 15},
                                         {display: 'flex', opacity: 1, x: 0, ease: Power2.easeInOut}, 1),
         
     homeToMain.fromTo($('.curator_title_wrapper'), 0.8, {opacity: 0, x: 30},
                                         {opacity: 1, x: 0, ease: Power2.easeInOut}, 1),
         
     homeToMain.fromTo($('.curator_list'), 0.8, {opacity: 0, display: 'none', x: 30},
                                     {opacity: 1, x: 0, display: 'block', ease: Power2.easeInOut}, 1.2)
     
    getLyricsAndDisplay(musixMatchQuery);
});