require("dotenv").config();
const Keys = require("./keys.js");
const Moment = require("moment");
const Spotify = require("node-spotify-api");
const Axios = require("axios");
const fs = require("fs");
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
             if (!artist) {
                 console.log('Must provide artist name as argument')
                 return
             }
            log('concert-this is processing')
            var encoded = encodeURIComponent(artist);
            var endPoint = `https://rest.bandsintown.com/artists/${encoded}/events?app_id=${Keys.bandsInTown.app_id}`;
            log(`API endpoint ${endPoint}`)
            make_api_call(endPoint, function (data) {
                var status = data.status;
                if (status !== 200) {
                    log(`Error ${status}, while calling concert-this`)
                    return;
                }
                if (status === 200) {
                    log(`Success ${status}`)
                    var info = data.data;
                    if (info.length > 0) {
                        for (let ii = 0; ii < info.length;ii++){
                        
                            var dateofEvent = info[ii].datetime;
                            var formatedDate = Moment(dateofEvent).format("MM/DD/YYYY");
                            var lineup = info[ii].lineup
                            var artisitInfo = 'Artist:'
                            for (let i = 0; i < lineup.length; i++){
                                 artisitInfo += ` ${lineup[i]}`
                            }
                            
                             artisitInfo = artisitInfo.trim()
                            console.log(artisitInfo)
                            console.log(`Date: ${formatedDate}`)
                            console.log(`Venue:${info[ii].venue.name}\n${info[ii].venue.city}, ${info[ii].venue.region}`);
                        };
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
           
            var endpoint = createOmdbEndpoint(movieName);

            make_api_call(endpoint, function (data) {
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
            fs.readFile(txtFilePath, "utf8", function (error, data) {
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
        },
        "--help": function () {
           console.log(`Commands:`);
           for (var key in commands) {
               if (key !== "checkCommand" && key !== "--help") {
                   console.log(`${key}`);
               }
           }
           process.exit(0);
        }
    };
};
var commands = new Commands();
if (!commands.checkCommand(command)) {
        console.log(`${command} is not a valid command. For help use --help`);
        process.exit(0);
} else {
        commands[command](argument);
}


function make_api_call(_endpoint, _promiss) {
    Axios.get(_endpoint).then(function (response) {
        _promiss(response);
    });
}

function createOmdbEndpoint(_title) {
    var queryS = _title ? _title : "Mr Nobody";
    var title = encodeURIComponent(queryS);
    var query = `t=${title}&type=movie`;
    return `http://omdbapi.com/?apikey=${Keys.omdb.apikey}&${query}`;
}

function log(txtString) {
    var line = txtString + "\r\n"
    fs.appendFile(logfile, line, function (error) {
        if (error) {
            console.log(`There was an error writing to the log file. Error ${error}`)
        }
    })
}
