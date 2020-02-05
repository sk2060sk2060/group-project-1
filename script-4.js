var button = document.getElementById("btn");
var authorizationToken;
var queryURL;
var searchTerm;
var musixMatchQueryArray = [];

$(document).ready(function () {

  requestToken();
  getToken();

});

function requestToken() {

  var redirectUri = window.location.href;
  if (redirectUri.includes("#access_token=")) return;

  if (redirectUri !== "https://sk2060sk2060.github.io/group-project-1" || redirectUri !== "http://127.0.0.1:8080/") {
    redirectUri = "http://127.0.0.1:8080/"

    var scope = "user-library-modify";
    window.location.href = "https://accounts.spotify.com/authorize?client_id=21b6e99dfa9948818d67377855f4d685&response_type=token&scope=" + encodeURIComponent(scope) + "&redirect_uri=" + redirectUri;
  }
}
function getToken() {
  var returnAuthorizationToken = location.hash.substr(1);
  authorizationToken = "Bearer " + returnAuthorizationToken.substring(returnAuthorizationToken.indexOf("=") + 1, returnAuthorizationToken.indexOf("&"));
  console.log(authorizationToken);

}

function buildQueryURL() {
  searchTerm = $("#search-term").val();
  // console.log(searchTerm);
  queryURL = "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist";
}

function searchForArtist() {
  buildQueryURL();
  $.ajax({
    method: "GET",
    // headers: {
    //     "Authorization": authorizationToken
    // },
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", authorizationToken);
      request.setRequestHeader("Accept", "application/json");
    },
    url: queryURL,
    }).done(function (response) {


        console.log(response);
        var firstSongID = response.artists.items[0].id;
        queryURL = `https://api.spotify.com/v1/artists/${firstSongID}/top-tracks?country=US`;

        $.ajax({
            method: "GET",
            // headers: {
            //     "Authorization": authorizationToken
            // },
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", authorizationToken);
                request.setRequestHeader("Accept", "application/json");
            },
            url: queryURL,
        }).done(function (response) {
          console.log("tracks", response);
          var openPlayer = document.querySelector(".btn-open-player");
          openPlayer.click();
          var trackItems = document.getElementsByClassName("list_item");
          displayTracks(response.tracks);
          for (var i = 0; i < trackItems.length; i++) {
            trackItems[i].id = i;
            var artist = response.tracks[i].artists[0].name;
            var title = response.tracks[i].name;
            var musixMatchQuery = `${artist} - ${title}`;
            musixMatchQueryArray.push(musixMatchQuery);
            trackItems[i].querySelector(".title").textContent = title;
            trackItems[i].querySelector(".artist").textContent = artist;
            $(trackItems[i]).attr("trackUri", response.tracks[i].uri);
          }
        });


    });
}


document.getElementById("search").addEventListener("click", function () {
  searchForArtist();
});



const listItem = $(".list")
$(document).on("click", ".list_item",function(){
 var songUri = this.getAttribute("trackuri");
  addTrackToPlayer(songUri);
})


const listEl = document.querySelector("#song-list");
listEl.addEventListener("click", function(event) {

  if (event.target.matches("li")) {
    console.log(event.target.id);
    var listItem = event.target;
    var artist = listItem.querySelector(".artist").textContent;
    var title = listItem.querySelector(".title").textContent;
    var musixMatchQuery = `${artist} - ${title}`;
    $("#curator").html(`<div class="curator_title_wrapper"><span>LP</span>
<div class="curator_line"></div>
<div class="info"></div>
<div class="playback_info"></div>
<div class="title">${title}</div>
<div class="artist">${artist}</div>
<div class="curator_line"></div><span>20</span>
</div>`);




  }
});

function displayTracks(tracks) {

  for (var i = 0; i < tracks.length; i++) {
      var trackName = tracks[i].name;
      var artistName = tracks[i].artists[0].name;
      var image = tracks[i].album.images[0].url;
      console.log(trackName);

      $("#song-list").append(`<li class="list_item choice" id="0" data-title="${trackName}" data-artist="">
      <div class="thumb"><img src="${image}"> </div>
      <div class="info"> 
        <div class="title">${trackName}</div>
        <div class="artist">${artistName}</div>
      </div>
    </li>`);
  
  }

}

function addTrackToPlayer(songUri) {
songUri = songUri.substring(songUri.lastIndexOf(":") + 1);

console.log("uri", songUri)
var player = $('<iframe id="playSong" width="600" height="350" frameborder="0" style={z-index:500;} allowtransparency="true" allow="encrypted-media"></iframe>');
player.attr("id","trackplayer")
var src= "https://open.spotify.com/embed/track/"+ songUri
player.attr("src", src);
$(".playback_wrapper").html(player);
}


function getLyricsAndDisplay(query) {
  var artistName = query.artist;
  var trackName = query.title;
  $("#thingy").text("");
  $.ajax({
    type: "GET",
    url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=" + trackName + "&q_artist=" + artistName + "&apikey=da9deef32d4c04ca1b56d484548bdf76",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    success: function (data) {
      var lyricsText = data.message.body.lyrics.lyrics_body;
      var divEL = document.createElement("div")
      divEL.setAttribute("style", "white-space: pre-wrap; font-size: 20px; color: brown; text-align: center; height: 250px; overflow-y:auto; font-weight: bold;");
      divEL.textContent = lyricsText;
      $("#thingy").append(divEL)       
    },
    error: function (jqXHR, textStatus, errorThrown) {
      var lyricsText = "Oops Could Not Find The Lyrics!";
      document.getElementsByClassName("curator_list_content")[0].setAttribute("style", "margin-left: 39%;");
      var divEL = document.createElement("div")
      divEL.setAttribute("style", "white-space: pre-wrap; font-size: 20px; color: brown; text-align: center; font-weight: bold;");
      divEL.textContent = lyricsText;
      $("#thingy").append(divEL)   
    }
  });
};