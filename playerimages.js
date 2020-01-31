

function displayTracks(  tracks){
    
    for (var i = 0; i <  tracks.length; i++) {
        var trackName = tracks[i].name;
        var artistName = tracks[i].artists[0].name;
        var image = tracks[i].album.images[0].url;
        console.log(trackName);
        
        $("#song-list").append(`<li class="list_item" id="0">
        <div class="thumb"><img src="${image}"> </div>
        <div class="info"> 
          <div class="title">${trackName}</div>
          <div class="artist">${artistName}</div>
        </div>
      </li>`);
    }

}