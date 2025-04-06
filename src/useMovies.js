import { useState, useEffect } from "react";
const KEY = "f84fc31d";

export function useMovies(query)
{
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
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
        //   handleCloseSelectedMovie();
          fetchMovies();
        }
    
        return function () {
          controller.abort();
        }
      }, [query]
    );

    return {movies, isLoading, isError}
}