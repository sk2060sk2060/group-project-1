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
    console.log(searchTerm);
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
    }).fail(function (jqXHR, textStatus, errorThrown) {
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
        }).done(function (response) {
          var openPlayer = document.querySelector(".btn-open-player");
          openPlayer.click();
          var trackItems = document.getElementsByClassName("list_item");
          for (var i = 0; i < trackItems.length; i++) {
            trackItems[i].id = i;
            var artist = response.tracks[i].artists[0].name;
            var title = response.tracks[i].name;
            var musixMatchQuery = `${artist} - ${title}`;
            musixMatchQueryArray.push(musixMatchQuery);
            trackItems[i].querySelector(".title").textContent = title;
            trackItems[i].querySelector(".artist").textContent = artist;
          }
        });

    });
}


document.getElementById("search").addEventListener("click", function () {
    searchForArtist();
});



const listEl = document.querySelector("#song-list");
// First way 
listEl.addEventListener("click", function(event) {
  if (event.target.matches("li")) {
    console.log(event.target);
    console.log(event.target.id);
    var listItem = event.target;
    var artist = listItem.querySelector(".artist").textContent;
    var title = listItem.querySelector(".title").textContent;
    var musixMatchQuery = `${artist} - ${title}`;
    getLyricsAndDisplay(musixMatchQuery);
  }
});

// // Alternate way 
// listEl.addEventListener("click", function(event) {
//   if (event.target.matches("li")) {
//     console.log(event.target);
//     console.log(event.target.id);
//     var listItem = event.target;
//     var listItemID = event.target.id;
//     var queryMusixMatch = musixMatchQueryArray[parseInt(listItemID)];
//     console.log(queryMusixMatch);
//     getLyricsAndDisplay(queryMusixMatch);
//   }
// });


function getLyricsAndDisplay(query){
  var trackSearch = query;
  document.getElementById("lyrics").innerHTML = "";
    $.ajax({
      type: "GET",
      data: {
        apikey:"da9deef32d4c04ca1b56d484548bdf76",
        q_track_artist: trackSearch,
        format:"jsonp",
        callback:"jsonp_callback"
      },
      url: "https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&callback=callback&quorum_factor=1&apikey=https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=0&apikey=da9deef32d4c04ca1b56d484548bdf76",
      dataType: "jsonp",
      jsonpCallback: 'jsonp_callback',
      contentType: 'application/json',
      success: function(data) {
        console.log(data); 
        var rand = data.message.body.track_list[0];
        var thisTrack = (rand.track.track_id)
        getLyricsNoww(thisTrack);    
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }    
  });
};

function getLyricsNoww(track){
  var trackId = track;
  console.log(trackId)
  $.ajax({
    type: "GET",
    data: {
      apikey:"da9deef32d4c04ca1b56d484548bdf76",
      track_id: trackId,
      format:"jsonp",
      callback:"jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=0&apikey=https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_id=0&apikey=da9deef32d4c04ca1b56d484548bdf76",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    success: function(data) {
      console.log(data); 
      console.log(data.message.body.lyrics.lyrics_body); 
      var lyricsBody = data.message.body.lyrics.lyrics_body.split(/\s+/).slice(0,100).join(" ")+ "...";
      var j = document.createElement("div")
      j.setAttribute("style", "white-space: pre-wrap; font-size: 20px; color: brown;");
      j.textContent = lyricsBody
      document.getElementById("lyrics").appendChild(j)
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }    
  });
 };


        
   