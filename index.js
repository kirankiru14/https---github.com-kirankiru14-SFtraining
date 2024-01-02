
let movieIds; 
let data;
let selectedGenres = [];
let combinedData;

const personUrl = 'https://api.themoviedb.org/3/person/';
const apiKey = '42ee719896b25f8821890615eeabf17f';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const imageUrl = 'https://image.tmdb.org/t/p/original';


let allMovies;
let moviesIdbyLanguage;
let moviesIdbyGenres;
let moviesIdbySearch;
let movieIdsByDecade;
let selectedDecade = null;

function openNav() {
	document.getElementById("mySidebar").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
  }
  
  function closeNav() {
	document.getElementById("mySidebar").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
  }


import('./src/moviesPlay.js')
    .then(res => {
        console.log('data imported into data constant');
        data = res;
        allMovies = data.movies.concat(data.hindiMovies);
        console.log('list of all movies are', allMovies);
        moviesIdbyLanguage = allMovies.map(movie => movie.tmdbId);
        var castData = data.castData;
        console.log('castData:', castData);
        filteredMoviesOutput = run(); // Save the output from run()
        let simplifiedMovies = allMovies.map(movie => ({
            name: movie.title,
            id: movie.tmdbId
        }));
        console.log(simplifiedMovies);
        combinedData = castData.concat(simplifiedMovies);
        console.log(combinedData);
        showGenres();
    });

function setMovieType() {
    const selectedMovieType = document.querySelector('input[name="frequency"]:checked').value;
    setMovieFilter(selectedMovieType);
}

function setMovieFilter(selectedMovieType) {
    console.log(selectedMovieType);
    if (selectedMovieType === "International") {
        moviesIdbyLanguage = data.movies.map(movie => movie.tmdbId);
    } else if (selectedMovieType === "Hindi") {
        moviesIdbyLanguage = data.hindiMovies.map(movie => movie.tmdbId);
    } else if (selectedMovieType === "All") {
        moviesIdbyLanguage = allMovies.map(movie => movie.tmdbId);
        console.log('all movie Ids are ', moviesIdbyLanguage);
    }

}

function showGenres() {
    let checkboxHTML = '<div id="GenresContainer">';
    console.log(data.genres);
    data.genres.forEach(element => {
        checkboxHTML += `<input type="checkbox" name="${element.name}" value="${element.id}"/>
                          <label>${element.name}</label> <br/>`;
    });
    checkboxHTML += '</div>';
    document.getElementById('Genres').innerHTML = checkboxHTML;
    document.getElementById('GenresContainer').addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            const genreId = parseInt(event.target.value);
            if (event.target.checked) {
                selectedGenres.push(genreId);
            } else {
                const index = selectedGenres.indexOf(genreId);
                if (index !== -1) {
                    selectedGenres.splice(index, 1);
                }
            }
            console.log("Selected Genres:", selectedGenres);
            setCondition(); 
        }
    });
}



function setCondition() {
    let selectedCondition = "";
    const andRadio = document.getElementById("andRadio");
    const orRadio = document.getElementById("orRadio");
    
    if (andRadio.checked) {
        selectedCondition = "AND";
    } else if (orRadio.checked) {
        console.log('line 432');
        selectedCondition = "OR";
    } else {
        console.log('inside else condition line 435');
        selectedCondition = "OR";
        orRadio.checked = true; 
    }

    run(selectedCondition);
    console.log(selectedCondition);
}


function run(selectedCondition) {
    let filteredMovies = [];
    if (selectedCondition === "AND") {
        data.movies.forEach(movie => {
            const hasAllGenres = selectedGenres.every(genreId =>
                movie.genres.some(genre => genre.id === genreId)
            );
            if (hasAllGenres) {
                filteredMovies.push(movie);
            }
        });
        data.hindiMovies.forEach(movie => {
            const hasAllGenres = selectedGenres.every(genreId =>
                movie.genres.some(genre => genre.id === genreId)
            );
            if (hasAllGenres) {
                filteredMovies.push(movie);
            }
        });
    } else {
        selectedGenres.forEach(genreId => {
            let moviesWithGenre = data.movies.filter(movie =>
                movie.genres.some(genre => genre.id === genreId)
            );
            let hindimoviesWithGenre = data.hindiMovies.filter(movie =>
                movie.genres.some(genre => genre.id === genreId)
            );
            moviesWithGenre = moviesWithGenre.concat(hindimoviesWithGenre);
            filteredMovies = filteredMovies.concat(moviesWithGenre);
        });
    }
    filteredMovies = Array.from(new Set(filteredMovies));
    moviesIdbyGenres = filteredMovies.map(movie => movie.tmdbId);
    if(selectedDecade != null){
        moviesIdbyGenres = moviesIdbyGenres.filter(movieId =>
            movieIdsByDecade.includes(movieId)
            );
    }else{
        moviesIdbyGenres;
    }
    console.log(filteredMovies);
    console.log('line 147 ', movieIds);
}

document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInput');
    var suggestionsContainer = document.getElementById('suggestionsContainer');

    searchInput.addEventListener('input', function () {
        var searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length >= 3) {
            var filteredCast = combinedData.filter(function (castMember) {
                return castMember.name.toLowerCase().includes(searchTerm);
            });
            displaySuggestions(filteredCast);
        } else {
            suggestionsContainer.innerHTML = '';
        }
    });

    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';

        suggestions.forEach(function (castMember) {
            var suggestionDiv = document.createElement('div');
            suggestionDiv.classList.add('suggestion');
            suggestionDiv.textContent = castMember.name;

            suggestionDiv.addEventListener('click', function () {
                selectedCastName = castMember.name;
                console.log('selected cast name is : ', selectedCastName);
                searchInput.value = selectedCastName;
                suggestionsContainer.innerHTML = '';
            });
            suggestionsContainer.appendChild(suggestionDiv);
        });
    }
});

function searchMovies() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredEnglishMovies = data.movies.filter(movie => {
        return (
            movie.title.toLowerCase().includes(searchValue) ||
            movie.cast.some(actor => actor.name.toLowerCase().includes(searchValue))
        );
    });
    const filteredHindiMovies = data.hindiMovies.filter(movie => {
        return (
            movie.title.toLowerCase().includes(searchValue) ||
            movie.cast.some(actor => actor.name.toLowerCase().includes(searchValue))
        );
    });
    filteredMovies = filteredHindiMovies.concat(filteredEnglishMovies);
    moviesIdbySearch = filteredMovies.map(movie => movie.tmdbId);
}

function showMovie() {
    console.log("line 211-->>", moviesIdbyLanguage);
    console.log("line 185-->>", moviesIdbyGenres);

    if (selectedGenres.length === 0) {
        // If no genres are selected, consider all movies
        movieIds = moviesIdbyLanguage;
    } else {
        movieIds = moviesIdbyLanguage.filter(function (element) {
            return moviesIdbyGenres.includes(element);
        });
    }

    console.log("line 185-->>", movieIds);
    getMovieInformation();
}


function showSearchedMovie() {
    movieIds = moviesIdbySearch;
    getMovieInformation();
}

function handleDecadeChange() {
    selectedDecade = parseInt(document.getElementById('decadeDropdown').value);
    console.log(`Selected Decade: ${selectedDecade}`);
    movieIds = getMovieIdsByDecade(selectedDecade);
     movieIds = movieIds.filter(id => moviesIdbyLanguage.includes(id))
    console.log('Movie IDs by decade :', movieIds);
    getMovieInformation();
}

function getMovieIdsByDecade(decade) {
    movieIdsByDecade = [];
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    allMovies.forEach(movie => {
        const movieYear = parseInt(movie.releaseDate.substring(0, 4));
        if (movieYear >= startYear && movieYear <= endYear ) {
            movieIdsByDecade.push(movie.tmdbId);
        }
    });
    return movieIdsByDecade;
}

function getMovieInformation() {
    console.log('Line 88---->', movieIds);
    const fetchArray = movieIds.map(movieId => {
        return (
            fetch(`${movieUrl}${movieId}?api_key=${apiKey}`)
                .then(response => response.json())
        );
    });

    Promise.all(fetchArray)
        .then(fetchResponses => {
            const moviesInfo = fetchResponses.map(resp => {
                return {
                    id: resp.id, overview: resp.overview,
                    posterPath: resp.poster_path, releaseDate: resp.release_date,
                    runTime: resp.runtime, tagLine: resp.tagline,
                    title: resp.title
                };
            });
            console.log('line 106 ', moviesInfo);
            if (moviesInfo.length == 0) {
                console.log('inside If');
                document.getElementById('content').innerHTML = "<h1>No Movies Found </h1>";
            } else {
                document.getElementById('content').innerHTML = getMovieHtml(moviesInfo);
            }
        });
}

function getMovieHtml(moviesInfo) {
    let movieHtml = ' <div class="ui link cards">';
    const movieCards = moviesInfo.reduce((html, movie) => {
        return html + `
        <div class="ui card">
                <div class="image">
                    <a href='./movie.html?id=${movie.id}&posterPath=${movie.posterPath}'>
                        <img src='${imageUrl}${movie.posterPath}' />
                    </a>
                </div>
                <div class="content">
                    <div class="header">${movie.title}</div>
                    <div class="meta">
                        <a>${movie.releaseDate}</a>
                    </div>
                    <div class="description">
                        ${movie.tagLine}
                    </div>
                </div>
            </div>
        `;
    }, '');
    movieHtml += `${movieCards}</div>`;
    return movieHtml;
}




