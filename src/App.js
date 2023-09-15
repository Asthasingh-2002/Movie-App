import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';
import Popup from './components/Popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [show, setShow] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [ratings, setRatings] = useState(0);
  const [comments, setComments] = useState("");


  const handleClose = () => setShow(false);

  const handleShow = () => {
    const movie = selectedMovie;
    movie.favourite = true;
    movie.ratings = ratings;
    movie.comments = comments;
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
    setShow(false);
    setRatings(0);
    setComments("");

  }

  useEffect(() => {
    getDefaultMovieList();
  }, []);

  useEffect(() => {
    if (searchValue) {
      getMovieRequest(searchValue);
    }
  }, [searchValue]);

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=b2739912`;
    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      const temp = responseJson.Search.map((item) => {
        return { ...item, favourite: false }
      })
      setMovies(temp);
    }
  };

  const getDefaultMovieList = async () => {
    const url = `http://www.omdbapi.com/?s=new&apikey=b2739912`;
    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      const temp = responseJson.Search.map((item) => {
        return { ...item, favourite: false }
      })
      setMovies(temp);
    }
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourits', JSON.stringify(items))
  };

  const addFavouriteMovie = (movie) => {
    if (!movie.favourite) {
      setShow(true);
      setSelectedMovie(movie);
    }
  };

  const removeFavouriteMovie = (movie) => {
    movie.favourite = false;
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
  };

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <Popup show={show} handleShow={handleShow} handleClose={handleClose} ratings={ratings} setRatings={setRatings} comments={comments} setComments={setComments} />

      <div className="row">
        <MovieList movies={movies} handleFavouritesClick={addFavouriteMovie} favouriteComponent={AddFavourites} type={"searchList"} />
      </div>

      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Favourites" />
      </div>

      <div className="row" style={{ overflowY: 'scroll', maxHeight: '70vh' }}>
        <MovieList
          movies={favourites}
          handleFavouritesClick={removeFavouriteMovie}
          favouriteComponent={RemoveFavourites}
          type={"favourite"}
        />
      </div>
    </div>
  );
}

export default App;
