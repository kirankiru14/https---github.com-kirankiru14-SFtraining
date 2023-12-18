"use strict";
 
let data;
let filteredMoviesOutput; // To store the output from run()
 
import('../src/moviesPlay.js')
    .then(res => {
        console.log('data imported into data constant');
        data = res;
        filteredMoviesOutput = run(); // Save the output from run()
    })
    .catch(error => {
        console.error('Error importing data:', error);
    });
 
function run() {
    const filteredMovies = data.hindiMovies.filter(movie => {
        return movie.runtimeMinutes > 180;
    });
 
    // const totalRuntime = filteredMovies.reduce((acc, movie) => {
    //     console.log('movie runTime = ',movie.runtimeMinutes);
    //     return acc + movie.runtimeMinutes;
    // }, 0);
 
    // console.log('Total Runtime: ' + totalRuntime + ', avg runtime: ' + Math.ceil(totalRuntime / filteredMovies.length));
 
    // Reformat the filtered output
    const output = filteredMovies.map(movie => {
        return {
            title: movie.title,
            releaseDate: movie.releaseDate,
            runtimeMinutes: movie.runtimeMinutes,
            id: movie.tmdbId
        };
    });
 
    console.log(output);
 
    return output; // Return the output to be used later
}
 
function getMovieInformation() {
	console.log('inside getMovieInfo');
    const apiKey = 'cc37399832696ae72d6412c05725058a';
    const imageUrl = 'https://image.tmdb.org/t/p/original';
 
    const contentDiv = document.getElementById('content');//this data will be shown in html
	
    // Iterate through the saved output and display movie information
    filteredMoviesOutput.forEach(movie => {
        const fetchUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`;
		
        fetch(fetchUrl)
            .then(response => response.json())
            .then(movieInfo => {
                const htmlContent = // `
            //     <div>
			// 	<img class="movie-poster" src='${imageUrl}${movieInfo.poster_path}' style='height: 300px;' />
            //         <h3>${movie.title}</h3>
            //         <p>Release Date: ${movie.releaseDate}</p>
            //         <p>Runtime Minutes: ${movie.runtimeMinutes}</p>
                    
            //     </div>
			// 	<hr>
			// 	<br>
            // `
			
			
									`<div class="ui link cards">
						<div class="card">
							<div class="image">
							<img class="movie-poster" src='${imageUrl}${movieInfo.poster_path}' style='height: 300px;' />
							</div>
							<div class="content">
							<div class="header">${movie.title}</div>
							<div class="description">
							<p>Release Date: ${movie.releaseDate}</p>
							<p>Runtime Minutes: ${movie.runtimeMinutes}</p>
							</div>
							</div>
						</div>`
			;
           
                contentDiv.innerHTML += htmlContent;
				console.log('Poster path url ',movieInfo.poster_path);
				console.log('movieInfo ', movieInfo);
            })
            .catch(error => console.error('Error fetching movie information:', error));
    });
}