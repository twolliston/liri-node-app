var liriAction = process.argv[2];
var liriSearch = process.argv[3];
var StartPos = 0;
var removeQuotes = "";
var valueArr = process.argv;


//module that loads environment variables 
require("dotenv").config();

// load modules
let Spotify = require("node-spotify-api");
let Twitter = require("twitter");
let request = require("request");

// load API keys
let keys = require('./keys.js');

// Load the fs package to read and write
let fs = require("fs");

// console.log(keys.spotify);
// console.log(keys.twitter);

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

switch (liriAction) {
    case "spotify-this-song":
        getSong();
        break;
    case "my-tweets":
        getTweet();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        getRandomSong();
        break;
}



function getSong() {

    if (liriSearch) {

        // We will then print the passed song title from process.argv  
        formattString = false;
        // build string without formatting 
        liriSearch = formattSong(valueArr, 3, removeQuotes);
        displaySong(liriSearch);

    } else {


        liriSearch = "the sign Ace of Base";
        // Remove double quote from string      
        var liriSearch = liriSearch.replace(/"/g, "");
        // Find the starting position of the song title
        startPos = liriSearch.indexOf(',');
        if (startPos > 0) {

            startPos += 1;
            formattString = true;

            // build string with formatting 
            liriSearch = formattSong(data, startPos, formattString);
            console.log("build from random text file after formatt: " + liriSearch);
        }
        displaySong(liriSearch);

    }
}

function getRandomSong() {

    // We will read the existing file containing song
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Remove double quote from string      
        var data = data.replace(/"/g, "");
        // Find the starting position of the song title
        startPos = data.indexOf(',');
        startPos += 1;
        formattString = true;

        // build string with formatting 
        liriSearch = formattSong(data, startPos, formattString);
        console.log("build from random text file after formatt: " + liriSearch);
        displaySong(liriSearch);
    });

}



function formattSong(songArr, startPos, formattString) {
    // console.log("start: " + songArr + " " + startPos + " " + removeQuotes);
    // Loop through the data and retreive the song title.
    var result = "";
    for (var i = startPos; i < songArr.length; i++) {
        if (songArr[i]) {
            if (formattString == true) {
                if (songArr[i]) {
                    result += songArr[i];
                }

            } else {
                result += songArr[i] + ' ';
            }
        }
    }
    // console.log("My result: " + result);
    return result;

}

function displaySong(printSong) {

    // We will then print the the song title

    // console.log("You have choosen this song: " + printSong);

    spotify
        .search({ type: 'track', query: printSong })
        .then(function (response) {
            // console.log(response);
            console.log("Artist Name: " + response.tracks.items[2].album.artists[0].name);
            console.log("Song Name: " + response.tracks.items[2].name);
            console.log("Preview Link: " + response.tracks.items[2].album.artists[0].external_urls.spotify);
            console.log("Album: " + response.tracks.items[2].album.name);

        })
        .catch(function (err) {
            console.log(err);
        });


}

function getTweet() {

    var params = { screen_name: 'twolliston1' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });

}



function movieThis() {

    if (liriSearch) {
        // We will then scrub the passed movie from process.argv  
        // build string without formatting 
        formattString = false;
        liriSearch = formattSong(valueArr, 3, removeQuotes);
    } else {
        // We will then use default movie 
        liriSearch = 'Mr. Nobody.';
    }

    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + liriSearch + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("The movie's title is: " + liriSearch);
            console.log("Year the movie came out: " + JSON.parse(body).Year);
            console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
        }
    });
}
