require("dotenv").config();
const Keys = require("./keys.js");
const Moment = require("moment");
const Spotify = require("node-spotify-api");
const Axios = require("axios");
const Fs = require("fs");
const txtFilePath = "random.txt"
const logfile = "log.txt"
var command = process.argv[2];
var argument = process.argv.slice(3).join(" ");

//Valid Commands Object to use check input command exist if so call the method with the same name. Arguments are passed as arguments
var Commands = function () {
    return {
        checkCommand: function (_commmand) {
            for (var command in this) {
                if (command === _commmand) {
                    return true;
                }
            }
            return false;
        },
        "concert-this": function (artist) {
            log('concert-this is processing')
            var encoded = encodeURIComponent(artist);
            var endPoint = `https://rest.bandsintown.com/artists/${encoded}/events?app_id=codingbootcamp`;
            log(`API endpoint ${endPoint}`)
            make_api_call(endPoint, function (data) {
                console.log(`\n\nCalling Bands in Town API Looking the Artist ${artist}`)
                var status = data.status;
                if (status !== 200) {
                    log(`Error ${status}, while calling concert-this`)
                    return;
                }
                if (status === 200) {
                    log(`Success ${status}`)
                    var info = data.data;
                    if (info.length > 0) {
                        info.forEach(element => {
                            var dateofEvent = element.datetime;
                            var formatedDate = Moment(dateofEvent).format("MM/DD/YYYY");
                            console.log(
                                `Date: ${formatedDate}\nArtist: ${element.venue.artist}\nVenue:\n${
                  element.venue.name
                  }\n${element.venue.city}, ${element.venue.region}`
                            );
                            log(`Date: ${formatedDate}\nArtist: ${element.venue.artist}\nVenue:\n${
                  element.venue.name
                  }\n${element.venue.city}, ${element.venue.region}`)
                        });
                    } else {
                        console.log(`Sorry, nothing found for ${artist}`)
                    }
                }
            });
        },
        "spotify-this-song": function (songName) {
            var searchObject = {};
            var artist = "";
            var spotifyApi = new Spotify({
                id: Keys.spotify.id,
                secret: Keys.spotify.secret
            });

            spotifyApi.setToken(Keys.spotify.token);

            if (!songName) {

                songName = "The Sign";
                artist = "Ace of Base";
                log(`No song name was provided, default ${songName}`)
                searchObject.type = "track";
                //Create Filtered Query to find the default
                searchObject.query = `track:"${songName}" artist:"${artist}"`;
            } else {
                searchObject.type = "track";
                searchObject.query = `"${songName}"`;
            }

            spotifyApi.search(searchObject).then(
                function (data) {
                    console.log(`\n\nCalling Spotify API looking up the song ${songName}`)
                    var tracks = data.tracks.items[0];
                    var artist = function () {
                        tracks.artists.forEach(artist => {
                            console.log(`Artist Name: ${artist.name}`);
                        });
                    };
                    artist();
                    console.log(`Track Name: ${tracks.name}\nAlbum Name: ${tracks.album.name}\nPreview Url: ${tracks.preview_url}`);
                    log(`Track Name: ${tracks.name}\nAlbum Name: ${tracks.album.name}\nPreview Url: ${tracks.preview_url}`)
                },
                function (err) {
                    console.error(`Erorr: ${err}`);
                }
            );
        },
        "movie-this": function (movieName) {
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

            var endpoint = createOmdbEndpoint(movieName);

            make_api_call(endpoint, function (data) {
                console.log(`\n\nCalling OMDB API for the movie ${movieName}`)
                var status = data.status;
                if (status !== 200) {
                    console.log(`Error: ${data.status}`);
                    return;
                }
                if (status === 200) {
                    movieList = [];
                    var movie = data.data;
                    var Title = movie.Title;
                    var Year = movie.Released.split(" ")[movie.Released.split(" ").length - 1];
                    var imdbRating = movie.imdbRating ? movie.imdbRating : "Not Rated";
                    var Tomatoes = movie.Tomatoes ? movie.Tomatoes : "Not Rated";
                    var Language = movie.Language;
                    var Plot = movie.Plot;
                    var Actors = movie.Actors;
                    console.log(`Title: ${Title}\nStaring: ${Actors}\nAbout: ${Plot}\nReleased: ${Year}\nimdbRating: ${imdbRating}\nRotten Tomatoes: ${Tomatoes}\nLanguage: ${Language}`);
                    log(`Title: ${Title}\nStaring: ${Actors}\nAbout: ${Plot}\nReleased: ${Year}\nimdbRating: ${imdbRating}\nRotten Tomatoes: ${Tomatoes}\nLanguage: ${Language}`);
                } else {
                    console.log(`Movie Not Found.\n\n`)
                    log(`Movie Not Found.\n\n`)
                }
            });
        },
        "do-what-it-says": function () {
            Fs.readFile(txtFilePath, "utf8", function (error, data) {
                if (error) {
                    console.log(error)
                    return
                }

                if (data) {

                    var lines = []
                    if (data.split("\r\n").length) {
                        lines = data.split("\r\n")
                    } else {
                        lines.push(data)
                    }
                    lines.forEach(line => {
                        var cmdArray = line.split(",")
                        commands[cmdArray[0]](cmdArray[1])
                    })



                }
            })
        }
    };
};
var commands = new Commands();
if (command === "--help") {
    console.log(`Commands:`);
    for (var key in commands.splice(1)) {
        console.log(`${key}`);
       
    }
     process.exit(0);
} else {
    if (!commands.checkCommand(command)) {
        console.log(`${command} is not a valid command. For help use --help`);
        process.exit(0);
    } else {
        commands[command](argument);
    }
}

function make_api_call(_endpoint, _promiss) {
    Axios.get(_endpoint).then(function (response) {
        _promiss(response);
    });
}

function createOmdbEndpoint(_title) {
    var queryS = _title ? _title : "Mr Nobody";
    var title = encodeURIComponent(queryS);
    var query = "t=" + title + "&type=movie";
    return `http://omdbapi.com/?apikey=${Keys.omdb.apikey}&${query}`;
}

function log(txtString) {
    var line = txtString + "\r\n"
    Fs.appendFile(logfile, line, function (error) {
        if (error) {
            console.log(`There was an error writing to the log file. Error ${error}`)
        }
    })
}
