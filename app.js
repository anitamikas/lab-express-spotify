require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/view');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
// const spotifyApi = new SpotifyWebApi({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET
//   });

const spotifyApi = new SpotifyWebApi({
    clientId: "8bacd3dec4604d37a0b7150bd8770741",
    clientSecret: "0125f2d7d0ac46f096b6f014bed6b4f6"
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:


app.get('/', (req, res) => {
    res.render('index');
});




//   spotifyApi
//   .searchArtists(req.query)
//   .then(data => {
//     console.log('The received data from the API: ', query.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//     spotifyApi.searchArtists()
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

app.get('/artist-search', (req, res, next) => {


    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items);
            res.render('artist-search-results', { artistArr: data.body.artists.items });

            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {

    let offset
    if (req.query.offset) {
        offset = Number(req.query.offset)
    } else {
        offset = 0
    }
    

    spotifyApi.getArtistAlbums(req.params.artistId, { limit : 6, offset : offset })
        .then(data => {
            console.log('The received data from the API albums: ', data.body);
            res.render('albums', { album: data.body.items, currentId: req.params.artistId, nextOffset: offset + 6 });
            
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/tracks/:artistId', (req, res, next) => {

spotifyApi.getAlbumTracks(req.params.artistId, { limit : 10, offset : 1 })
  .then(data => {
    console.log(data.body);
    res.render('tracks', { track: data.body.items});
  }, function(err) {
    console.log('Something went wrong!', err);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 '));


