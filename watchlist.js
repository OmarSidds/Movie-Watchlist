
import { watchlistMovies } from './index.js';

const mainContentWatchlistDiv = document.getElementById("mainContentWatchlistDiv")

function emptyMovieArr(watchlistMovies) {
    if(watchlistMovies.length === 0) {
        mainContentWatchlistDiv.innerHTML = `
            <div class="emptyWatchlist">
                <p>Your watchlist is looking a little empty...</p>
                <a href="./index.html">+ Let's add some movies!</a>
            </div>
        `
    }else {
        mainContentWatchlistDiv.innerHTML = ""
    }
}

function removeDuplicates(arr) {
    return [...new Set(arr)];
  }


emptyMovieArr(watchlistMovies)
let watchlistMoviesNoDuplicates = removeDuplicates(watchlistMovies);
generateMovieWatchlist(watchlistMoviesNoDuplicates)

async function generateMovieWatchlist(watchlistMoviesNoDuplicates) {

    for(let i = 0; i < watchlistMoviesNoDuplicates.length; i++) {
        try {

            let response = await fetch(`http://www.omdbapi.com/?i=${watchlistMoviesNoDuplicates[i]}&apikey=5f03362d`, {method: "GET"});
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText)
            }
    
            let watchlistMovieData = await response.json()
            inputDataIntoMainContentWatchlist(watchlistMovieData)
            
        } catch (error) {

            console.error('There has been a problem with your fetch operation:', error);
        }
    } 
}

function inputDataIntoMainContentWatchlist(watchlistMovieData) {

    mainContentWatchlistDiv.innerHTML += `
        <div class="movieContainer" value=${watchlistMovieData.imdbID}>
                
            <div class="movieInfoPoster">
                <img class="moviePoster" src=${watchlistMovieData.Poster}>
            </div>

            <div class="movieInfo">
                <h2 class="movieTitle">${watchlistMovieData.Title}</h2>
                <div class="movieTimeGenreBtn">
                    <p>${watchlistMovieData.Runtime}</p>
                    <p>${watchlistMovieData.Genre}</p>
                    <button class="watchlistBtnRemove" data-imdbid=${watchlistMovieData.imdbID}>
                        <i class="material-icons"></i>
                        - Remove
                    </button>
                </div>

                <div class="text-container" id="textContainer">
                    <p class="plot">${watchlistMovieData.Plot}</p>
                </div>
            </div>
                
        </div>
        <hr>
        `
    const removeBtnsArr = document.querySelectorAll(".watchlistBtnRemove");
    removeBtnsArr.forEach(btn => {
        btn.addEventListener("click", (event) => {
            watchlistMoviesNoDuplicates = watchlistMoviesNoDuplicates.filter(item => item !== event.target.dataset.imdbid)
            watchlistMovies = localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMoviesNoDuplicates));
            watchlistMovies = removeDuplicates(watchlistMoviesNoDuplicates)
            mainContentWatchlistDiv.innerHTML = ""
            generateMovieWatchlist(watchlistMovies)
        })
    })
}
