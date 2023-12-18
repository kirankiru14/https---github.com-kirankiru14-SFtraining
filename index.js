"use strict";

let data;
let filteredMoviesOutput; // To store the output from run()
const apiKey = 'cc37399832696ae72d6412c05725058a';
const imageUrl = 'https://image.tmdb.org/t/p/original';
const personUrl = 'https://api.themoviedb.org/3/person/';
const movieUrl = 'https://api.themoviedb.org/3/movie/';
const queryString = window.location.search;
const queryParamsMap = new URLSearchParams(queryString);
import('../src/moviesPlay.js')
    .then(res => {
        console.log('data imported into data constant');
        data = res;
        filteredMoviesOutput = run(); // Save the output from run()
		showMovie(queryParamsMap.get('id'),queryParamsMap.get('posterPath'));
		const optionsArray = moviesDropdown(filteredMoviesOutput);
		document.getElementById('movies').innerHTML = optionsArray;
    })
    .catch(error => {
        console.error('Error importing data:', error);
    });

function run() {
    const filteredMovies = data.hindiMovies.filter(movie => {
        return movie.runtimeMinutes > 180;
    });

    // Reformat the filtered output
    const output = filteredMovies.map(movie => {
        return {
            title: movie.title,
            releaseDate: movie.releaseDate,
            runtimeMinutes: movie.runtimeMinutes,
            id: movie.tmdbId,
			PosterPath: movie.posterUrl
        };
    });

    console.log(output);
	
    return output; // Return the output to be used later
}

function getMovieInformation() {
    console.log('inside getMovieInfo');

    const contentDiv = document.getElementById('content'); // this data will be shown in html
    let htmlContent = `<div class="ui three column grid">`;

    // Iterate through the saved output and display movie information
    const fetchPromises = filteredMoviesOutput.map(movie => {
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

  function moviesDropdown(filteredMoviesOutput) {
	let options;
	const moviesList = filteredMoviesOutput.forEach(movie => {
		options += `<option value="${movie.id}">${movie.title}</option>`
		console.log('movie id : ',movie.id);
	});
	return options;
	// document.getElementById('movies').innerHTML = options;
  }

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
