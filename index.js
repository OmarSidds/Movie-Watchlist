const searchBtn = document.getElementById("search-Btn")
const searchInput = document.getElementById("search-Input")
const mainContent = document.getElementById("mainContent")
const iconAndText = document.getElementById("iconAndText")
export let watchlistMovies = JSON.parse(localStorage.getItem("watchlistMovies")) || [];


function addCharacter(str, char) {
    const characters = str.split('');

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].trim() === '') {
            characters[i] = char;
        }
    }

    return characters.join('');
}


function callBack() {
    iconAndText.innerHTML = ''

    if(searchInput.value == ""){
        mainContent.innerHTML = `
            <p class="emptySearch">Unable to find what you’re looking for. 
                Please try another search.</p>
        `
    }else {
        mainContent.innerHTML = ""
        let searchValue = searchInput.value
        searchValue = addCharacter(searchValue, "+")
        fetchData(searchValue)
    }
}

try {
    searchBtn.addEventListener("click", callBack)
} catch(error) {

}



async function fetchData(searchValue) {
    try {

        const response = await fetch(`http://www.omdbapi.com/?s=${searchValue}&apikey=5f03362d`, {method: "GET"});

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const arrayOfMovies = await response.json();
        specificMovieData(arrayOfMovies)
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


async function specificMovieData(arrayOfMovies) {

    for(let i = 0; i < arrayOfMovies.Search.length; i++) {
        try {

            let response = await fetch(`http://www.omdbapi.com/?i=${arrayOfMovies.Search[i].imdbID}&apikey=5f03362d`, {method: "GET"});
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText)
            }
    
            let watchlistMovieData = await response.json()

            inputDataIntoMainContentDiv(watchlistMovieData)
            
        } catch (error) {

            console.error('There has been a problem with your fetch operation:', error);
        }
    } 
}

function inputDataIntoMainContentDiv(watchlistMovieData) {
    
    mainContent.innerHTML += `
        <div class="movieContainer" value=${watchlistMovieData.imdbID}>
                
            <div class="movieInfoPoster">
                <img class="moviePoster" src=${watchlistMovieData.Poster}>
            </div>

            <div class="movieInfo">
                <h2 class="movieTitle">${watchlistMovieData.Title}</h2>
                <div class="movieTimeGenreBtn">
                    <p>${watchlistMovieData.Runtime}</p>
                    <p>${watchlistMovieData.Genre}</p>
                    <button class="watchlistBtn" data-imdbid=${watchlistMovieData.imdbID}>
                        <i class="material-icons"></i>
                        + Watchlist
                    </button>
                </div>

                <div class="text-container" id="textContainer">
                    <p class="plot">${watchlistMovieData.Plot}</p>
                </div>
            </div>
                
        </div>
        <hr>
        `
        const watchlistBtns = document.querySelectorAll(".watchlistBtn");
        watchlistBtns.forEach(btn => {
            btn.addEventListener("click", (event) => {
                storeMovieData(event.target.dataset.imdbid);
            })
        })
}

/* Code for Watchlist page */

function storeMovieData(imdbID) {
    watchlistMovies.push(imdbID)
    localStorage.setItem("watchlistMovies", JSON.stringify(watchlistMovies));
}