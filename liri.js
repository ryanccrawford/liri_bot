require("dotenv").config();
const Keys = require("./keys.js");
const Moment = require("moment");
const spotify = require("node-spotify-api");
const axios = require("axios");

var command = process.argv[2];
var argument = process.argv.slice(3).join(" ");

//Valid Commands Object to use check input command exist if so call the method with the same name. Arguments are passed as arguments
var Commands = function() {
  return {
    checkCommand: function(_commmand) {
      for (var command in this) {
        if (command === _commmand) {
          return true;
        }
      }
      return false;
    },
    "concert-this": function(artist) {
      var encoded = encodeURIComponent(artist);
      var end_point = `https://rest.bandsintown.com/artists/${encoded}/events?app_id=codingbootcamp`;
      make_api_call(end_point, function(data) {
        var status = data.status;
        if (status !== 200) {
          return;
        }
        if (status === 200) {
          var info = data.data;
          if (info.length > 0) {
            info.forEach(element => {
              var dateofEvent = element.datetime;
              var formatedDate = Moment(dateofEvent).format("MM/DD/YYYY");
              console.log(
                `Date: ${formatedDate}\nArtist: ${artist}\nVenue:\n${
                  element.venue.name
                }\n${element.venue.city}, ${element.venue.region}`
              );
            });
          }
        }
      });
    },
    "spotify-this-song": function(songName) {
      var searchObject = {};
      var artist = "";
      var spotifyApi = new spotify({
        id: Keys.spotify.id,
        secret: Keys.spotify.secret
      });

      spotifyApi.setToken(Keys.spotify.token);

      if (!songName) {
        songName = "The Sign";
        artist = "Ace of Base";

        searchObject.type = "track";
        //Create Filtered Query to find the default
        searchObject.query = `track:"${songName}" artist:"${artist}"`;
      } else {
        searchObject.type = "track";
        searchObject.query = `"${songName}"`;
      }

      spotifyApi.search(searchObject).then(
        function(data) {
          var tracks = data.tracks.items[0];
          var artist = function() {
            tracks.artists.forEach(artist => {
              console.log(`Artist Name: ${artist.name}`);
            });
          };
          artist();
          console.log(`Track Name: ${tracks.name}`);
          console.log(`Album Name: ${tracks.album.name}`);
          console.log(`Preview Url: ${tracks.preview_url}`);
        },
        function(err) {
          console.error(`Erorr: ${err}`);
        }
      );
    },
    "movie-this": function(movieName) {
      // * This will output the following information to your terminal/bash window:

      // ```
      //   * Title of the movie.
      //   * Year the movie came out.
      //   * IMDB Rating of the movie.
      //   * Rotten Tomatoes Rating of the movie.
      //   * Country where the movie was produced.
      //   * Language of the movie.
      //   * Plot of the movie.
      //   * Actors in the movie.
      // ```* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

      //  * If you haven't watched "Mr. Nobody," then you should: <http://www.imdb.com/title/tt0485947/>

      //  * It's on Netflix!

      var endpoint = createOmdbEndpoint();

      make_api_call(endpoint, function(data) {
        var status = data.status;
        if (status !== 200) {
          console.log(`Error: ${data.status}`);
          return;
        }
        if (status === 200) {
          movieList = [];
          var movie = data.data;
          var Title = movie.Title;
          var Year = movie.Year;
          var Rated = movie.Rated;
          var Tomatoes = movie.Tomatoes;
          var Language = movie.Language;
          var Plot = movie.Plot;
          var Actors = movie.Actors;
          console.log(`Title: ${Title}\nStaring: ${Actors}\nAbout: ${Plot}\nReleased: ${Year}\nRated: ${Rated}\nRotten Tomatoes: ${Tomatoes}\nLanguage: ${Language}`);
        }
      });
    },
    "do-what-it-says": function() {
      const filesystem = require("fs");
    }
  };
};
var commands = new Commands();
if (command === "--help") {
  console.log(`You can use:`);
  for (var key in commands.Keys) {
    console.log(`${key}`);
    process.exit(0);
  }
} else {
  if (!commands.checkCommand(command)) {
    console.log(`${command} is not a valid command. For help use --help`);
    process.exit(0);
  } else {
    commands[command](argument);
  }
}

function make_api_call(_endpoint, _promiss) {
  axios.get(_endpoint).then(function(response) {
    _promiss(response);
  });
}
function createOmdbEndpoint(_title) {
  var queryS = _title ? _title : "Mr Nobody";
  var title = encodeURIComponent(queryS);
  var query = "t=" + title + "&type=movie";
  return `http://omdbapi.com/?apikey=${Keys.omdb.apikey}&${query}`;
}
