const searchBtn = document.getElementById("search-Btn")
const searchInput = document.getElementById("search-Input")
const mainContent = document.getElementById("mainContent")

function addCharacter(str, char) {
    const characters = str.split('');

    for (let i = 0; i < characters.length; i++) {
        if (characters[i].trim() === '') {
            characters[i] = char;
        }
    }

    return characters.join('');
}

async function fetchData(searchValue) {
    try {

        const response = await fetch(`http://www.omdbapi.com/?s=${searchValue}&apikey=5f03362d`, {method: "GET"});

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const arrayOfMovies = await response.json();

        mainContent.innerHTML = '';
        document.getElementsByClassName("iconAndText");
        console.log(arrayOfMovies)
        specificMovieData(arrayOfMovies)
        
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

/* Finish loopArray function   */


async function specificMovieData(arrayOfMovies) {

    for(let i = 0; i < arrayOfMovies.Search.length; i++) {
        try {

            let response = await fetch(`http://www.omdbapi.com/?i=${arrayOfMovies.Search[i].imdbID}&apikey=5f03362d`, {method: "GET"});
    
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText)
            }
    
            let singleMovieData = await response.json()
            
            inputDataIntoMainContentDiv(singleMovieData)
            
        } catch (error) {

            console.error('There has been a problem with your fetch operation:', error);
        }
    } 
}

function inputDataIntoMainContentDiv(singleMovieData) {

    mainContent.innerHTML += `
        <div class="movieContainer">
                
            <div class="movieInfoPoster">
                <img class="moviePoster" src=${singleMovieData.Poster}>
            </div>

            <div class="movieInfo">
                <h2 class="movieTitle">${singleMovieData.Title}</h2>
                <div class="movieTimeGenreBtn">
                    <p>${singleMovieData.Runtime}</p>
                    <p>${singleMovieData.Genre}</p>
                    <button id="watchlistBtn">
                        <i class="material-icons">add</i>
                        Watchlist
                    </button>
                </div>
                <div class="text-container" id="textContainer">
                    <p class="plot">${singleMovieData.Plot}</p>
                </div>
                <button class="view-more-btn" id="viewMoreBtn">View More</button>
            </div>
                
        </div>
        `
}

function callBack() {
    let searchValue = searchInput.value
    searchValue = addCharacter(searchValue, "+")
    fetchData(searchValue)
}
searchBtn.addEventListener("click", callBack)



const textContainer = document.getElementById('textContainer');
const viewMoreBtn = document.getElementById('viewMoreBtn');

viewMoreBtn.addEventListener('click', function() {
    textContainer.classList.toggle('expanded');
    if (textContainer.classList.contains('expanded')) {
        viewMoreBtn.textContent = 'View Less';
    } else {
        viewMoreBtn.textContent = 'View More';
    }
});
