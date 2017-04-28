// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVdl2rA2nKOz4OSGuftySdI4B9mvAfPQ4",
    authDomain: "second-screen-sports.firebaseapp.com",
    databaseURL: "https://second-screen-sports.firebaseio.com",
    projectId: "second-screen-sports",
    storageBucket: "second-screen-sports.appspot.com",
    messagingSenderId: "910265912496"
  };
  firebase.initializeApp(config);
  
var provider = new firebase.auth.TwitterAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
  // You can use these server side with your app's credentials to access the Twitter API.
  var token = result.credential.accessToken;
  var secret = result.credential.secret;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

//variable to reference database
var database = firebase.database();

//database values
var team = "";

//store user input in database
$("#search").on("click", function() {
  team = $(".search-term:selected").val();

  database.ref().set({
    team: team,
  });

});


//vars for queryUrl parameters

var todayDate = moment().format("YYYY" + "MM" + "DD");
console.log(todayDate);


//////////////////////////////////
//ajax to get sports api data/////
//////////////////////////////////



var queryUrl = "https://www.mysportsfeeds.com/api/feed/pull/nba/2017-playoff/scoreboard.json?fordate=" + todayDate;

$.ajax({
  method: "GET",
  url: queryUrl,
  dataType: 'json',
  headers: {
    "Authorization": "Basic " + btoa("joecabralez" + ":" + "twattwat!3")
  },
}).done(function(SportsData) {
  console.log("------------------------");
  console.log(SportsData);
  console.log(SportsData.scoreboard);

  var awayTeamCity1 = SportsData.scoreboard.gameScore[0].game.awayTeam.City
  var awayTeamName1 = SportsData.scoreboard.gameScore[0].game.awayTeam.Name
  var awayTeamScore1 = SportsData.scoreboard.gameScore[0].awayScore
  
  var homeTeamCity1 = SportsData.scoreboard.gameScore[0].game.homeTeam.City
  var homeTeamName1 = SportsData.scoreboard.gameScore[0].game.homeTeam.Name
  var homeTeamScore1 = SportsData.scoreboard.gameScore[0].homeScore

  var awayTeamCity2 = SportsData.scoreboard.gameScore[1].game.awayTeam.City
  var awayTeamName2 = SportsData.scoreboard.gameScore[1].game.awayTeam.Name
  var awayTeamScore2 = SportsData.scoreboard.gameScore[1].awayScore
  
  var homeTeamCity2 = SportsData.scoreboard.gameScore[1].game.homeTeam.City
  var homeTeamName2 = SportsData.scoreboard.gameScore[1].game.homeTeam.Name
  var homeTeamScore2 = SportsData.scoreboard.gameScore[1].homeScore
 
  $("#away-team-city1").html(awayTeamCity1);
  $("#away-team-name1").html(awayTeamName1);
  $("#away-team-score1").html(awayTeamScore1);
  
  $("#home-team-city1").html(homeTeamCity1);
  $("#home-team-name1").html(homeTeamName1);
  $("#home-team-score1").html(homeTeamScore1);

  $("#away-team-city2").html(awayTeamCity2);
  $("#away-team-name2").html(awayTeamName2);
  $("#away-team-score2").html(awayTeamScore2);
  
  $("#home-team-city2").html(homeTeamCity2);
  $("#home-team-name2").html(homeTeamName2);
  $("#home-team-score2").html(homeTeamScore2);

//refresh json data
  var previous = null;
    var current = null;
    setInterval(function() {
        $.getJSON(SportsData, function(json) 
          {
            current = JSON.stringify(json);            
            if (previous && current && previous !== current) {
                console.log('refresh');
                location.reload();
            }
            previous = current;
        });                       
    }, 100);



});


////////////////////////////////////////////
/////WIKIPEDIA FUNCTION WITH AJAX CALL//////
////////////////////////////////////////////

var searchData = "";


function wikipediaBox(search) {
 var RRsearchKey = search;
 var RRqueryURL = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+RRsearchKey+"&callback=?";
    $.ajax({
        type: "GET",
        url: RRqueryURL,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data) {

          console.log(data);
 
            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);
 
            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
   

            $('#wikipedia').html($(blurb).find('p'));
 
        },
        error: function (errorMessage) {
        }
    });
}

////////////////////////////////////////
/////GIPHY FUNCTION WITH AJAX CALL//////
////////////////////////////////////////

function displayGifs() {
    
    //the URL to search the site and grab 10 results
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + searchData + "&api_key=dc6zaTOxFJmzC&limit=5"; 

    //ajax function that gets a response from the site
    $.ajax({
      url: queryURL,
      method:"GET",
    }).done(function(response) {
      console.log(response);
      for (var i = 0; i < response.data.length; i++) {
        var gifs = response.data[i].images.downsized.url;
        $("#gifs").prepend("<img src='" + gifs + " '>");
      }
      
            
    });
};

$("#search").on("click", function(event) {
    
    event.preventDefault();
    searchData = $(".search-term:selected").val();
    
    console.log(searchData);
    displayGifs();
    wikipediaBox(searchData);
})



////////////////////////////////////////
///////////////TWITTER//////////////////
////////////////////////////////////////
//$("#twitter").html("<a class='twitter-timeline'  href='https://twitter.com/search?q=" + searchData + " data-widget-id='857764958561595392'>")

//function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
  //if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

function showTweets() {
  var searchData = $(".search-term:selected").val();
  var tweetQueryURL = "https://api.twitter.com/1.1/search/tweets.json?q=" + searchData + "&result_type=recent"
  $.ajax({
      url: tweetQueryURL,
      method:"GET",
      dataType: "json",
    }).done(function(tweets) {
      console.log(tweets);
      /*for (var i = 0; i < response.data.length; i++) {
        var gifs = response.data[i].images.downsized.url;
      }
      $("#gifs").append("<img src='" + gifs + " '>");*/
    });
};
