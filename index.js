//import 'semantic-ui-css/semantic.min.css'
"use strict"

let data

import('./src/moviesPlay.js')
	.then(res => {
		console.log('data imported into data constant');
		data = res;
	});

function inputChanged(event) {
	document.getElementById('output').innerHTML = event.target.value;
}

function onSubmit(event) {
	event.preventDefault();
	console.log('Form Submitted'); 
}

function showCounts() {
	console.log('showcounts ',data.getCounts());
	moviesBtwDates();
}

//this is core javascript code
// function moviesBtwDates() {
// 	let MoviesWithinDates = [];
// 	const startDate = '1970-01-01';
// 	const endDate = '1980-01-01';
// 			for(let i =0; i<data.hindiMovies.length;i++){
// 				let relDate = data.hindiMovies[i].releaseDate;
// 				if(relDate>=startDate && relDate<=endDate){
// 					MoviesWithinDates.push(data.hindiMovies[i]);
// 				}
// 			}
// 			console.log(MoviesWithinDates);
	
// }


	function moviesBtwDates() {
	// var employees =[
	// 	{id:1, name:'Ram'},
	// 	{id:2, name:'sham'}
	// ];

	// var nameArr = []
	// employees.forEach(function(employee) {
	// 	nameArr.push(employee.name);
	// });

	// console.log('emp Names ',nameArr);


const startDate = '1970-01-01';
const endDate = '1990-01-01';

const selectedMovies =data.hindiMovies
.filter(movie => movie.releaseDate >=startDate && movie.releaseDate <= endDate)
.map(movie =>({movie:movie.originalTitle,release:movie.releaseDate}));
	console.log('selected movies are ',selectedMovies);
	
	let newTable = '<tr><th>movie Name </th><th>releaseDate</th></tr>';
selectedMovies.forEach(element => {
	newTable += `<tr><td>${element.movie}</td><td>${element.release}</td></tr>`
});
document.getElementById('getTable').innerHTML = newTable;
		console.log(newTable);


		const genresType = 'Crime';
		const genresTypeMovie = data.hindiMovies.filter(movie => movie.genres.filter(a =>a.name===genresType) )
		.map(movie => ({movie:movie.originalTitle, movieGenres:movie.genres.map(g => g.name).join(',')}));
		var getcontent = document.getElementById('getGenres');
		console.log('selected genres movie are ',genresTypeMovie );
		let genresTable = '<tr><th>movie Name </th><th>Genres</th></tr>';
		genresTypeMovie.forEach(element => {
			genresTable += `<tr><td>${element.movie}</td><td>${element.movieGenres}</td></tr>`;
		});
		console.log('genres Table ',genresTable);
		getcontent.innerHTML=genresTable;
	}	