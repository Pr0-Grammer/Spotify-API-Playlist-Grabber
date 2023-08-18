import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import Listbox from "./Listbox";
import Detail from "./Details";
import { Credentials } from "./Creds";
import axios from "axios";

function App() {

  const spotify = Credentials(); // get credentials from Creds.js

  const [token, setToken] = useState('');
  const [genres, setGenres] = useState({selectedGenre: '', listOfGenresFromAPI: []});
  const [playlist, setPlaylist] = useState({selectedPlaylist: '', listOfPlaylistFromAPI: []});
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []});
  const [trackDetails, setTrackDetails] = useState(null);


  useEffect (() => {

    axios('https://accounts.spotify.com/api/token', {

      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(spotify.ClientId + ':' + spotify.ClientSecret)
      },
      data: 'grant_type=client_credentials',
      method: 'POST'

    })
    .then(tokenResponse => {
      console.log(tokenResponse.data.access_token);
      setToken(tokenResponse.data.access_token);

      axios('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers:{Authorization: 'Bearer ' + tokenResponse.data.access_token}
      })
      .then(genreResponse => {
      setGenres({selectedGenre: genres.selectedGenre, 
        listOfGenresFromAPI: genreResponse.data.categories.items
      })

    })

  });

  }, [genres.selectedGenre, spotify.ClientId, spotify.ClientSecret]);

  const genreChanged = val => {
    setGenres({
      selectedGenre: val,
      listOfGenresFromAPI: genres.listOfGenresFromAPI
    });

    axios(`https://api.spotify.com/v1/browse/categories/${val}/playlists?limit=10`, {
      method: 'GET',
      headers:{'Authorization' : 'Bearer ' + token}
    })
    .then (playlistResponse => {
      setPlaylist({
        selectedPlaylist: playlist.selectedPlaylist,
        listOfPlaylistFromAPI: playlistResponse.data.playlists.items
      })
      console.log(val)
    });
  }

  const playlistChanged = val => {
    setPlaylist({
      selectedPlaylist: val,
      listOfPlaylistFromAPI: playlist.listOfPlaylistFromAPI
    });
  }

  const buttonClicked = e => {
    e.preventDefault();
    
    axios(`https://api.spotify.com/v1/playlists/${playlist.selectedPlaylist}/tracks?limit=10`, {
      method: 'GET',
      headers:{'Authorization' : 'Bearer ' + token}
    })
    .then (tracksResponse => {
      setTracks({
        selectedTrack: tracks.selectedTrack,
        listOfTracksFromAPI: tracksResponse.data.items
      })
    });
  }

  const listboxClicked = val => {
    const currentTracks = [...tracks.listOfTracksFromAPI];

    const trackDetails = currentTracks.filter(t => t.track.id === val);

    setTrackDetails(trackDetails[0].track);
  }

  return (
    <form onSubmit={buttonClicked}>
      <h2>Playlist Grabber</h2>
      <div className="App">
        <div className="Functionality">
          <p>Genre</p>
          <Dropdown options={genres.listOfGenresFromAPI} selectedVal={genres.selectedGenre} changed = {genreChanged} />
          <p>Playlist</p>
          <Dropdown options={playlist.listOfPlaylistFromAPI} selectedPlaylist={playlist} changed = {playlistChanged} /> 
          <button className="form-btn" type="submit">Search</button>
          <Listbox items={tracks.listOfTracksFromAPI} clicked={listboxClicked} />
        </div>
        <div className="Track">
          {trackDetails && <Detail {...trackDetails} /> }
        </div>
      </div>
    </form>
  );
}

export default App;
