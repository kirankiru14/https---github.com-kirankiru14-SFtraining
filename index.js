"use strict";

let data;
let filteredMoviesOutput; // To store the output from run()
let genresTypeMovie;
let genresType = null;
const apiKey = 'cc37399832696ae72d6412c05725058a';
const imageUrl = 'https://image.tmdb.org/t/p/original';
const personUrl = 'https://api.themoviedb.org/3/person/';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const queryString = window.location.search;
const queryParamsMap = new URLSearchParams(queryString);
let genreNames;
let selectedCastName;
let filteredMovies;
let movieIds;
let simplifiedMovies;
let combinedData;


function openNav() {
	document.getElementById("mySidebar").style.width = "250px";
	document.getElementById("main").style.marginLeft = "250px";
  }
  
  function closeNav() {
	document.getElementById("mySidebar").style.width = "0";
	document.getElementById("main").style.marginLeft= "0";
  }

  

  
  


import('../src/moviesPlay.js')
    .then(res => {
		console.log(res);
        data = res;
        console.log('data imported into data constant');
		console.log('after populate genre dropdown');
		//console.log('cast Data is ',data.castData);
        
		// Now you can access castData from the imported data
        var castData = data.castData;
        console.log('castData:', castData);
		  filteredMoviesOutput = run(); // Save the output from run()
		  // Create a new array with only title and tmdbId properties
		simplifiedMovies = data.hindiMovies.map(movie => ({
			name: movie.title,
			id: movie.tmdbId
		}));
		console.log(simplifiedMovies);
		// Combine castData and simplifiedMovies into a single array
  		combinedData = castData.concat(simplifiedMovies);
		console.log(combinedData);
		//populateGenreDropdown();
		const optionsArray = moviesDropdown(filteredMoviesOutput);
		showMovie(queryParamsMap.get('id'),queryParamsMap.get('posterPath'));
		document.getElementById('movies').innerHTML = optionsArray;
		console.log('line 23');
		
		
    })
    .catch(error => {
        console.error('Error importing data:', error);
    });



//------------------------------------------------------------------------------------------------------------------
	// Other JavaScript code that doesn't require the DOM to be fully loaded

	document.addEventListener('DOMContentLoaded', function () {
		var searchInput = document.getElementById('castSearch');
		var suggestionsContainer = document.getElementById('suggestionsContainer');
	  
		searchInput.addEventListener('input', function () {
		  var searchTerm = searchInput.value.toLowerCase();
		  
		  if (searchTerm.length >= 3) {
            var filteredCast = combinedData.filter(function (castMember) {
                return castMember.name.toLowerCase().includes(searchTerm);
            });
            displaySuggestions(filteredCast);
        } else {
            // Clear suggestions if the input length is less than 3
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
			  // Handle selection (you can customize this)
			  //alert('Selected: ' + castMember.name);
			  // Clear the search input and suggestions
			  searchInput.value = selectedCastName;
			  suggestionsContainer.innerHTML = '';
			  searchMovies();
			});
	  
			suggestionsContainer.appendChild(suggestionDiv);
		  });
		}
	  });

	  function searchMovies() {
		// Get the search input value
		const searchValue = document.getElementById('castSearch').value.toLowerCase();
	 
		// Filter movies based on the search value
		const filteredEnglishMovies = data.movies.filter(movie => {
			// Check if the search value matches the movie title or any cast name
			return ( 
				movie.title.toLowerCase().includes(searchValue) ||
				movie.cast.some(actor => actor.name.toLowerCase().includes(searchValue))
			);
		});
		const filteredHindiMovies = data.hindiMovies.filter(movie => {
		  // Check if the search value matches the movie title or any cast name
		  return (
			  movie.title.toLowerCase().includes(searchValue) ||
			  movie.cast.some(actor => actor.name.toLowerCase().includes(searchValue))
		  );
	  });
	 
	  filteredMovies = filteredHindiMovies.concat(filteredEnglishMovies);
		// Display the search results
		movieIds = filteredMovies.map(movie => ({
			movie: movie.originalTitle,
			id: movie.tmdbId,
			releaseDate:movie.releaseDate,
			runtimeMinutes: movie.runtimeMinutes,
			PosterPath: movie.posterUrl
			//movieGenres: movie.genres.map(g => g.name).join(',')
		}));
		 
		getMovieInformation();
	}
  

//----------------------------------------Genres selection method-----------------------------------------------

	// function populateGenreDropdown(){
	// 	let genreOptions =`<option value="" disabled selected>Select Genre</option>`;
	// 	genreNames = data.genres.map(genre => genre.name);
	// 	console.log('genres data ', genreNames);
	// 	genreNames.forEach(element => {
	// 		console.log(element);
	// 		genreOptions += `<option value="${element}">${element}</option>`
	// 	});
	// 	document.getElementById('genre').innerHTML=genreOptions;
		
	// }



	function genreSelected() {
		 genresType = document.getElementById('genre').value;
		console.log('selected genre is: ', genresType);
		
		genresTypeMovie = data.hindiMovies
		.filter(movie => movie.genres.some(a => a.name === genresType))
		.map(movie => ({
			movie: movie.originalTitle,
			id: movie.tmdbId,
			releaseDate:movie.releaseDate,
			runtimeMinutes: movie.runtimeMinutes,
			PosterPath: movie.posterUrl,
			movieGenres: movie.genres.map(g => g.name).join(',')
		}));
		//getMovieInformation();
		
		console.log('selected genres movie are ', genresTypeMovie);
		return genresTypeMovie;
	}

//-----------------------------------------------RUN METHOD-------------------------------------------------------


function run() {
	const filteredMovies = data.hindiMovies.filter(movie => {
		//console.log('line 43 ',movie);
		if(genresType != null){
			console.log('just a log to check');
		}
        return movie.tmdbId > 180 ;
    });
    // Reformat the filtered output
    const output = filteredMovies.map(movie => {
		// const genreNames = movie.genres.map(genre => genre.name);
		// console.log('genres data ', genreNames);
        return {
            title: movie.title,
            releaseDate: movie.releaseDate,
            runtimeMinutes: movie.runtimeMinutes,
            id: movie.tmdbId,
			PosterPath: movie.posterUrl
			
        };
    });
    console.log('line 78 ',output);
	//getCastDetails();
    return output; // Return the output to be used later
}


//-----------------------------------method to generate cast data---------------------------------------------


function getCastDetails(){
// Assuming you have the movie data stored in variables named 'movies' and 'hindiMovies'

const allCast = [];
const encounteredIds = new Set();

// Function to process cast array and add unique cast members to allCast
function processCast(castArray) { 
  castArray.forEach(castMember => {
    if (castMember.name && castMember.id) {
      if (!encounteredIds.has(castMember.id)) {
        const castInfo = {
          name: castMember.name,
          id: castMember.id,
        };

        allCast.push(castInfo);
        encounteredIds.add(castMember.id);
      }
    }
  });
}

// Iterate through each movie in the 'movies' array
data.movies.forEach(movie => {
  if (movie.cast && Array.isArray(movie.cast)) {
    processCast(movie.cast);
  }
});

// Iterate through each movie in the 'hindiMovies' array
data.hindiMovies.forEach(movie => {
  if (movie.cast && Array.isArray(movie.cast)) {
    processCast(movie.cast);
  }
});

// Sort the 'allCast' array based on id in ascending order
allCast.sort((a, b) => {
	// Convert ids to numbers for proper numeric comparison
	const idA = parseInt(a.id, 10);
	const idB = parseInt(b.id, 10);
  
	return idA - idB;
  });

// 'allCast' now contains an array of objects with unique 'name' and 'id' properties for all cast members in both movies and hindiMovies
console.log(allCast);

// Assuming you have the 'allCast' array

// Convert the 'allCast' array to a JSON string
const jsonString = JSON.stringify(allCast, null, 2);

// Create a Blob from the JSON string
const blob = new Blob([jsonString], { type: 'application/json' });

// Create a download link
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'castData.json';

// Append the link to the body
document.body.appendChild(link);

// Trigger a click on the link to start the download
link.click();

// Remove the link from the body
document.body.removeChild(link);

console.log('JSON file exported successfully.');

}


//--------------------------------------------Get Movie Information-----------------------------------------------


function getMovieInformation() {
    console.log('inside getMovieInfo');

    const contentDiv = document.getElementById('content'); // this data will be shown in html
    let htmlContent = `<div class="ui three column grid">`;

    // Iterate through the saved output and display movie information
	const fetchPromises = movieIds.map(movie => {
    //const fetchPromises = genresTypeMovie.map(movie => {
        const fetchUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;

        return fetch(fetchUrl)
            .then(response => response.json())
            .then(movieInfo => {
                htmlContent += `
                        <div class="column">
                            <div class="ui fluid card">
								<a href='./movie.html?id=${movieInfo.id}&posterPath=${movieInfo.poster_path}'>
                                    <img class="movie-poster" src='${imageUrl}${movieInfo.poster_path}' 
																style='height: 300px; width: 100%;' 
																title="Click to Know more about : ${movieInfo.title}, Id : ${movieInfo.id}"/>
                                </a>
                                <div class="content">
                                    <div class="header">${movieInfo.title}</div>
                                        <p>Release Date: ${movie.releaseDate}</p>
                                        <p>Runtime Minutes: ${movie.runtimeMinutes}</p>
                                    </div>
                                
                            </div>
                        
                    </div>`;
                console.log('Poster path url ', movieInfo.poster_path);
				console.log('movie Id ', movieInfo.id);
				console.log('complete movie Info ', movieInfo);
            })
            .catch(error => console.error('Error fetching movie information:', error));
    });

    // Use Promise.all to wait for all fetch operations to complete
    Promise.all(fetchPromises)
        .then(() => {
            htmlContent += `</div>`;
            contentDiv.innerHTML += htmlContent;
            console.log('All movie information fetched');
        })
        .catch(error => console.error('Error in Promise.all:', error));
}

	
//-------------------------------------------SHOW MOVIE--------------------------------------------------------


function showMovie(id, posterPath) {
	const movieInfo = data.hindiMovies.find(movie => {
	  return movie.tmdbId === id;
	})
	getCastHtml(movieInfo.cast)
	  .then(castHtml => {
		document.getElementById('castInfo').innerHTML = castHtml;
	  })
  
	document.getElementById('title').innerHTML = movieInfo.title;
	document.getElementById('overview').innerHTML = movieInfo.overview;
	document.getElementById('moviePoster').innerHTML = `<img src='${imageUrl}${posterPath}' />`
	console.log('poster path : ',posterPath);
  }

  async function getCastHtml(cast) {
	const castFetchArray = cast.map(cm => {
	  return (
		fetch(`${personUrl}${cm.id}?api_key=${apiKey}`)
		  .then(response => response.json())
	  )
	});
	const castResponses = await Promise.all(castFetchArray);
  
	let castHtml = '<div class="ui cards">'
	castResponses.forEach(cr => {
	  castHtml+= `
		<div class="card">
		  <div class="content">
			<img class="right floated mini ui image" src="${imageUrl}${cr.profile_path}">
			<div class="header">
			  ${cr.name}
			</div>
			<div class="meta">
			  ${cr.birthday}
			</div>
		  </div>
		</div>
	  `
	})
	castHtml+= '</div>';
	
	return castHtml;
  }


//----------------------------------------------MOVIES DROPDOWN-------------------------------------------------

  function moviesDropdown(filteredMoviesOutput) {
	let options;
	const moviesList = filteredMoviesOutput.forEach(movie => {
		options += `<option value="${movie.id}">${movie.title}</option>`
		console.log('movie id : ',movie.id);
	});
	return options;
	// document.getElementById('movies').innerHTML = options;
  }


//-----------------------------------------MOVIESELECTED----------------------------------------------------

  function movieSelected(){
	  const selectedMovieId = document.getElementById('movies').value;
	  console.log('movie id ',document.getElementById('movies').value);
	  console.log('selected movie Id ',selectedMovieId);
	  let selectedMoviePosterPath;
	const selectedMovieUrl = `${movieUrl}${selectedMovieId}?api_key=${apiKey}`;
	fetch(selectedMovieUrl)
	.then(result => result.json())
	.then(selectedMovieInfo => {
		selectedMoviePosterPath = selectedMovieInfo.poster_path;
		showMovie(selectedMovieId, selectedMoviePosterPath);
	});

  }
