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
        data = res;
        allMovies = data.movies.concat(data.hindiMovies);
        moviesIdbyLanguage = allMovies.map(movie => movie.tmdbId);
        var castData = data.castData;
        filteredMoviesOutput = run();
        let simplifiedMovies = allMovies.map(movie => ({
            name: movie.title,
            id: movie.tmdbId
        }));
        combinedData = castData.concat(simplifiedMovies);
        showGenres();
    });
//this is onchange method of language radio button
function setMovieType() {
    const selectedMovieType = document.querySelector('input[name="frequency"]:checked').value;
    setMovieFilter(selectedMovieType);
}

function setMovieFilter(selectedMovieType) {
    if (selectedMovieType === "International") {
        moviesIdbyLanguage = data.movies.map(movie => movie.tmdbId);
        filter();
    } else if (selectedMovieType === "Hindi") {
        moviesIdbyLanguage = data.hindiMovies.map(movie => movie.tmdbId);
        filter();
    } else if (selectedMovieType === "All") {
        moviesIdbyLanguage = allMovies.map(movie => movie.tmdbId);
        filter();
    }
}

function showGenres() {
    let checkboxHTML = '<div id="GenresContainer">';
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
        selectedCondition = "OR";
    } else {
        selectedCondition = "OR";
        orRadio.checked = true;
    }

    run(selectedCondition);
}

function run(selectedCondition) {
    let filteredMovies = [];
    if (selectedCondition === "AND") {
        allMovies.forEach(movie => {
            const hasAllGenres = selectedGenres.every(genreId =>
                movie.genres.some(genre => genre.id === genreId)
            );
            if (hasAllGenres) {
                filteredMovies.push(movie);
            }
        });
        filter();
    } else {
        filteredMovies = selectedGenres.reduce((result, genreId) => {
            const genreMovies = allMovies.filter(movie => movie.genres.some(genre => genre.id === genreId));
            return result.concat(genreMovies);
        }, []);
        console.log('OUTPUT line 119 : ',filteredMovies);
    }
    filteredMovies = Array.from(new Set(filteredMovies));
    console.log('OUTPUT line 122 : ',filteredMovies);
    moviesIdbyGenres = filteredMovies.map(movie => movie.tmdbId);
    filter();
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
                searchInput.value = selectedCastName;
                suggestionsContainer.innerHTML = '';
            });
            suggestionsContainer.appendChild(suggestionDiv);
        });
    }
});

function searchMovies() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filteredMovies = allMovies.filter(movie => {
        return (
            movie.title.toLowerCase().includes(searchValue) ||
            movie.cast.some(actor => actor.name.toLowerCase().includes(searchValue))
        );
    });
    moviesIdbySearch = filteredMovies.map(movie => movie.tmdbId);
}

function showSearchedMovie() {
    movieIds = moviesIdbySearch;
    getMovieInformation();
}

function handleDecadeChange() {
    selectedDecade = parseInt(document.getElementById('decadeDropdown').value);
    getMovieIdsByDecade(selectedDecade);
    filter();
}

function getMovieIdsByDecade(decade) {
    movieIdsByDecade = [];
    const startYear = parseInt(decade);
    const endYear = startYear + 9;
    allMovies.forEach(movie => {
        const movieYear = parseInt(movie.releaseDate.substring(0, 4));
        if (movieYear >= startYear && movieYear <= endYear) {
            movieIdsByDecade.push(movie.tmdbId);
        }
    });
    return movieIdsByDecade;
}

function getMovieInformation() {
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
                    title: resp.title,
                    genres:resp.genres
                };
            });
            if (moviesInfo.length == 0) {
                document.getElementById('content').innerHTML = "<h1>No Movies Found </h1>";
            } else {
                document.getElementById('content').innerHTML = getMovieHtml(moviesInfo);
            }
        });
}

function getMovieHtml(moviesInfo) {
    let movieHtml = ' <div class="ui link cards">';
    const movieCards = moviesInfo.reduce((html, movie) => {
        const genresHtml = Array.isArray(movie.genres) ? movie.genres.map(genre => genre.name).join(', ') : '';
        return html + `
        <div class="card">
                <div class="image">
                    <a href='./movie.html?id=${movie.id}&posterPath=${movie.posterPath}'>
                        <img src='${imageUrl}${movie.posterPath}'
                        title="Click to Know more about : ${movie.title}, Id : ${movie.id}" />
                    </a>
                </div>
                <div class="content">
                    <div class="header">${movie.title}</div>
                    <div class="meta">
                        <a>${movie.releaseDate}</a><br>
                        <a>${genresHtml}</a>
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

function filter(){
    let finalFilteredIds = moviesIdbyLanguage;

    if (moviesIdbyGenres && moviesIdbyGenres.length > 0) {
        finalFilteredIds = finalFilteredIds.filter(movieId =>
            moviesIdbyGenres.includes(movieId)
        );
    }

    if (movieIdsByDecade && movieIdsByDecade.length > 0) {
        finalFilteredIds = finalFilteredIds.filter(movieId =>
            movieIdsByDecade.includes(movieId)
        );
    }
    movieIds = finalFilteredIds;
    getMovieInformation();
}
