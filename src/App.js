import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "f84fc31d";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  function handleAddWatchedMovie(movie)
  {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatchedMovie(id)
  {
    setWatched((watched) => watched.filter((movie) => {
      return movie.imdbID !== id;
    }))
  }

  useEffect(function () {

    const controller = new AbortController();
    async function fetchMovies () {
      try {
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal : controller.signal});
        const data = await res.json();

        if(!res.ok) {
          throw new Error ("Something Went Wrong while fetching the Movies");
        }

        if(data.Response === 'False') {
          throw new Error (data.Error); 
        }

        setMovies(data.Search);
        setIsLoading(false);
      }
      catch (err) {
        setIsError(err.message);
      }
    }
    
    if (query.length < 3) {
      setMovies([]);
    }
    else {
      handleCloseSelectedMovie();
      fetchMovies();
    }

    return function () {
      controller.abort();
    }
  }, [query]);

  function handleSelectedMovie(id)
  {
    setSelectedMovieId((selectedMovieId) => selectedMovieId === null ? selectedMovieId = id : selectedMovieId === id ? selectedMovieId = null : selectedMovieId = id);
  }

  function handleCloseSelectedMovie()
  {
    setSelectedMovieId(null);
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query = {query} setQuery = {setQuery} />
        <Results movies = {movies} />
      </NavBar>

      <Main>
        
        <MoviesBox isOpen = {isOpen1} setIsOpen = {setIsOpen1}>
          { isLoading ? <Loader isError = {isError} />: <MoviesList movies = {movies} setSelectedMovieId={handleSelectedMovie} />}
        </MoviesBox>

        <MoviesBox isOpen = {isOpen2} setIsOpen = {setIsOpen2}>
          {
            selectedMovieId ? 
              <SelectedMovie 
                selectedMovieId={selectedMovieId} 
                closeMovie = {handleCloseSelectedMovie} 
                onAddWatchedMovie = {handleAddWatchedMovie}
                watchedMovies = {watched}
              /> :
            <>
              <WatchedMovies watched = {watched} />
              <WatchedMoviesList watched = {watched} onDeleteWatchedMovie = {handleDeleteWatchedMovie} />
            </>
          }
        </MoviesBox>

      </Main>
      
    </>
  );
}

function Loader({isError})
{
  return <p className="loader">{isError !== false ? isError : "Loading..."}</p>
}

function NavBar({children})
{

  return (
    <nav className="nav-bar">
        {children}
      </nav>
  )
}

function Search ({query, setQuery})
{
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function Logo()
{
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function Results({movies})
{
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}


function Main({children})
{
  return (
    <main className="main">
        {children}
      </main>
  )
}

function MoviesBox({isOpen, setIsOpen, children})
{
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        children
      )}
    </div>
  )
}

function MoviesList({movies, setSelectedMovieId})
{
  return (
    <ul className="list list-movies">
          {movies?.map((movie) => (
            <Movie movie = {movie} setSelectedMovieId = {setSelectedMovieId} />
          ))}
    </ul>
  )
}

function Movie({movie, setSelectedMovieId})
{
  return (
    <li key={movie.imdbID} onClick={() => setSelectedMovieId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function WatchedMovies({watched})
{
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(2);

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

function SelectedMovie({selectedMovieId, closeMovie, onAddWatchedMovie, watchedMovies})
{

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {Title: title, Year: year, Poster : poster , Runtime: runtime, imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre} = movie;
  const [userRating, setUserRating] = useState(0);

  const alreadyWatchedMovie = watchedMovies.filter((movie) => {
    return movie.imdbID === selectedMovieId;
  });

  const watchedUserRating = watchedMovies.find((movie) => {
    return movie.imdbID === selectedMovieId
  })?.userRating;


  console.log(alreadyWatchedMovie?.userRating);
  
  function handleAdd()
  {
    const newWatchedMovie = {
      imdbID : selectedMovieId,
      title,
      poster,
      imdbRating : Number(imdbRating),
      runtime : Number(runtime.split(" ").at(0)),
      year,
      userRating,
    };

    onAddWatchedMovie(newWatchedMovie);
    closeMovie();
  }

  useEffect(function () {

    function callback (e) {
      if(e.code === 'Escape') {
        closeMovie();
      }
    }

    document.addEventListener('keydown',callback)
    return function () {
      document.removeEventListener('keydown', callback);
    }
  }, [closeMovie]);

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  },[selectedMovieId]);

  useEffect( function () {
    if(!title) {
      return;
    }
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";
    };
  },[title]);

  return (
    <div className = "details">
    {
      isLoading ? <p className="loader">Loading...</p> :
      <>
        <header>
          <button className="btn-back" onClick={closeMovie}>⬅</button>
          <img src = {poster} alt = {`Poster of ${title}`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genre}</p>
            <p><span>⭐</span>{imdbRating} IMDb rating</p>
          </div>
        </header>

      <section>
        <div className="rating">
          {
            alreadyWatchedMovie.length ? 
              <p>You have already rated this movie with {watchedUserRating} ⭐</p> :
              <>
              <StarRating maxRating = {10} onSetRating = {setUserRating} />
              {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to List</button>}
              </>
          }
        </div>
        <p><em>{plot}</em></p>
        <p>Starring {actors}</p>
        <p>Directed By :- {director}</p>
      </section>
      </>
    }
    </div>
  )
}

function WatchedMoviesList({watched, onDeleteWatchedMovie})
{
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie = {movie} onDeleteWatchedMovie = {onDeleteWatchedMovie} />
      ))}
    </ul>
  )
}

function WatchedMovie({movie, onDeleteWatchedMovie})
{
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatchedMovie(movie.imdbID)}>X</button>
      </div>
    </li>
  )
}
