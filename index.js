const searchBtn = document.getElementById("search-Btn")
const searchInput = document.getElementById("search-Input")
const mainContent = document.getElementById("mainContent")
const iconAndText = document.getElementById("iconAndText")
const watchlistBtns = document.querySelectorAll(".watchlistBtn")
let watchlistMovies = []

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

    let searchValue = searchInput.value
    searchValue = addCharacter(searchValue, "+")
    fetchData(searchValue)
}
searchBtn.addEventListener("click", callBack)


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
    
            let singleMovieData = await response.json()

            inputDataIntoMainContentDiv(singleMovieData)
            
        } catch (error) {

            console.error('There has been a problem with your fetch operation:', error);
        }
    } 
}

function inputDataIntoMainContentDiv(singleMovieData) {
    
    mainContent.innerHTML += `
        <div class="movieContainer" value=${singleMovieData.imdbID}>
                
            <div class="movieInfoPoster">
                <img class="moviePoster" src=${singleMovieData.Poster}>
            </div>

            <div class="movieInfo">
                <h2 class="movieTitle">${singleMovieData.Title}</h2>
                <div class="movieTimeGenreBtn">
                    <p>${singleMovieData.Runtime}</p>
                    <p>${singleMovieData.Genre}</p>
                    <button class="watchlistBtn" data-imdbid=${singleMovieData.imdbID}>
                        <i class="material-icons"></i>
                        + Watchlist
                    </button>
                </div>

                <div class="text-container" id="textContainer">
                    <p class="plot">${singleMovieData.Plot}</p>
                </div>
            </div>
                
        </div>
        <hr>
        `
        const watchlistBtns = document.querySelectorAll(".watchlistBtn");
        watchlistBtns.forEach(btn => {
            btn.addEventListener("click", (event) => {
                hello(event.target.dataset.imdbid);
            })
        })
}

function hello(imdbID) {
    watchlistMovies.push(imdbID)
}





/*
watchlistBtns.forEach(btn => {
    btn.addEventListener("click", (event) => {
        hello(event.target.dataset.imdbid);
    });
});


const textContainer = document.getElementById('textContainer');
const viewMoreBtn = document.getElementById('viewMoreBtn');

viewMoreBtn.addEventListener('click', function() {
    textContainer.classList.toggle('expanded');
    if (textContainer.classList.contains('expanded')) {
        viewMoreBtn.textContent = 'View Less';
    } else {
        viewMoreBtn.textContent = 'View More';
    }
})

*/
