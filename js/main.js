"use strict";
const url = "https://rough-harvest-liver.glitch.me/movies";
// draw movies from input list
let drawMovies = moviesList => {
	$(".container").html("");
	moviesList.forEach(movieObject => {
		let ratingString = "";
		let goldRatingString = "";
		let rating = Number(movieObject.rating);
		for (let i = 0; i < rating; i++) {
			goldRatingString += "&#9733;";
		}
		for (let i = 0; i < 5 - rating; i++) {
			ratingString += "&#9733;";
		}

		$(".container").append(`
			<div id="movie${movieObject.id}" class="card mx-1 my-1">
				<div class="card-header bg-dark">
					<a href="#card${movieObject.id}" data-bs-toggle="collapse">
						<img src="${movieObject.poster}" class="card-img-top">
						<div class="card-bg">
							<p class="p-0 m-1">${movieObject.genre}</p>
							<p class="p-0 m-1"><span class="goldStar">${goldRatingString}</span>${ratingString}</p>
						</div>
					</a>
				</div>
				<div id="card${movieObject.id}" class="collapse">
					<div class="card-body">
					<h3>${movieObject.title}</h3>
						<p class="p-0 m-0">${movieObject.year}</p>
						<p class="p-0 m-0">Plot: ${movieObject.plot}</p>
						<p class="p-0 m-0">Director: ${movieObject.director}</p>
						<p class="p-0 m-0">Actors: ${movieObject.actors}</p>
						<button id="delete${movieObject.id}">Delete This Movie</button>
					</div>
				</div>
			</div>
		`);
		// let movieDiv = document.createElement("div");
		// movieDiv.setAttribute("id", "movie" + movieObject.id);
		// movieDiv.setAttribute("class", "card");
		// let movieTitle = document.createElement("h3");
		// movieTitle.innerText = movieObject.title;
		// movieDiv.append(movieTitle);
		// let movieYear = document.createElement("p");
		// movieYear.innerText = movieObject.year;
		// movieDiv.append(movieYear);
		// let movieRating = document.createElement("p");
		// let rating = Number(movieObject.rating);
		// for (let i = 0; i < rating; i++) {
		// 	movieRating.innerHTML += "&#9733;";
		// }
		// for (let i = 0; i < 5 - rating; i++) {
		// 	movieRating.innerHTML += "&#9734;";
		// }
		// movieDiv.append(movieRating);
		// let movieDirector = document.createElement("p");
		// movieDirector.innerText = "Director: " + movieObject.director;
		// movieDiv.append(movieDirector);
		// let movieActors = document.createElement("p");
		// movieActors.innerText = "Actors: " + movieObject.actors;
		// movieDiv.append(movieActors);
		// let moviePlot = document.createElement("p");
		// moviePlot.innerText = "Plot: " + movieObject.plot;
		// movieDiv.append(moviePlot);
		// let deleteButton = document.createElement("button");
		// deleteButton.setAttribute("id", "delete" + movieObject.id);
		// deleteButton.innerText = "Delete This Movie";
		// movieDiv.append(deleteButton);
		// $(".container").append(movieDiv);
		let deleteButton = document.getElementById(`delete${movieObject.id}`)
		deleteButton.addEventListener("click", () => {
			deleteButton.setAttribute("disabled", true);
			fetch(url + "/" + movieObject.id, {
				method: "DELETE", headers: {'Content-Type': 'application/json'}
			})
				.then(response => {
					$(".container").html("");
					getMovies();
				})
				.catch(error => console.log(error));
		});
	});
}

// get movies from external database, then draw
let getMovies = () => fetch(url)
	.then(response => response.json())
	.then(data => {
		moviesArray.length = 0;
		genreList.length = 0;
		$("#genreList").html("")
		data.forEach(movie => moviesArray.push(movie));
		drawnMovies = moviesArray;
		drawMovies(moviesArray);
		data.forEach(movie => {
			let genreArray = movie.genre.split(", ")
			genreArray.forEach(genre => {
				if (!genreList.includes(genre)) {
					genreList.push(genre);
				}
			});
		});
		genreList.forEach(genre => {
			let genreButton = document.createElement("button");
			genreButton.setAttribute("class", "btn btn-link dropdown-item");
			genreButton.innerText = genre;
			$('#genreList').append(genreButton);
			genreButton.addEventListener("click", () => {
				genreFilter = true;
				selectedGenre = genre;
				filterMovies();
			});
		});
		$("#loading").attr('style', 'display: none');
	})
	.catch(err => console.log(err));
$("#addMovieButton").click(function () {
	$("#addMovieButton").attr("disabled", true);
	fetch(url, {
		method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#addTitle").val(),
			director: $("#addDirector").val(),
			year: $("#addYear").val(),
			genre: $("#addGenre").val(),
			actors: $("#addActors").val(),
			plot: $("#addPlot").val(),
			rating: $("input[name='addRating']:checked").val(),
			poster: $("#poster").val()
		})
	})
		.then(response => {
			$(".container").html("");
			getMovies();
			$("#addMovieButton").attr("disabled", false);
		})
		.catch(error => console.log(error));
});
$("#editMovieButton").click(() => {
	$("#movieList").html("");
	moviesArray.forEach((element) => {
		let movieButton = document.createElement("button");
		movieButton.setAttribute("class", "btn btn-link dropdown-item");
		movieButton.innerText = element.title;
		$('#movieList').append(movieButton);
		movieButton.addEventListener('click', () => {
			$('#editTitle').val(element.title);
			$('#editDirector').val(element.director);
			$('#editYear').val(element.year);
			$('#editGenre').val(element.genre);
			$('#editActors').val(element.actors);
			$('#editPlot').val(element.plot);
			$('input[value=' + element.rating + '][name="editRating"]').attr("checked", true);
			$('#editID').val(element.id);
			$("#editPoster").val(element.poster);
		});
	});
});
$("#saveButton").click(() => {
	// console.log(moviesArray[$("#editID").val() - 1].poster);
	$("#saveButton").attr("disabled", true);
	console.log($("#editID").val());
	fetch(url + "/" + $('#editID').val(), {
		method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#editTitle").val(),
			director: $("#editDirector").val(),
			year: $("#editYear").val(),
			genre: $("#editGenre").val(),
			actors: $("#editActors").val(),
			plot: $("#editPlot").val(),
			rating: $("input[name='editRating']:checked").val(),
			poster: $("#editPoster").val()
		})
	})
		.then(response => {
			$(".container").html("");
			getMovies();
			$("#saveButton").attr("disabled", false);

		})
		.catch(error => console.log(error));
});
let movieBody = {
	title: $("#title").val(), rating: $("#")
}
let moviesArray = [];
let genreList = [];
let genreFilter = false;
let ratingFilter = false;
let titleFilter = false;
let selectedGenre = "";
getMovies();

let drawnMovies = []

let filterMovies = () => {
	let filteredMovies = drawnMovies;
	if (titleFilter) {
		let searchInput = $("#movieSearch").val().toUpperCase();
		filteredMovies = filteredMovies.reduce((filteredByTitle, movie) => {
			if (movie.title.toUpperCase().includes(searchInput)) {
				filteredByTitle.push(movie);
			}
			return filteredByTitle;
		}, []);
	}
	if (genreFilter) {
		filteredMovies = filteredMovies.reduce((filteredByGenre, movie) => {
			if (movie.genre.includes(selectedGenre)) {
				filteredByGenre.push(movie);
			}
			return filteredByGenre;
		}, []);
	}
	if (ratingFilter) {
		let selectedRating = $("input[name='sortRating']:checked").val();
		filteredMovies = filteredMovies.reduce((filteredByRating, movie) => {
			if (movie.rating === selectedRating) {
				filteredByRating.push(movie);
			}
			return filteredByRating;
		}, []);
	}
	drawMovies(filteredMovies);
}

function searchMovie() {
	titleFilter = true;
	filterMovies();
}

function searchRating() {
	ratingFilter = true;
	filterMovies();
}

function sortMoviesName() {
	drawnMovies.sort(function (a, b) {
		return (a.title > b.title) ? 1 : -1
	});
	filterMovies()
}

$("#sortByName").click(() => sortMoviesName())

function sortMoviesGenre() {
	drawnMovies.sort(function (a, b) {
		return (a.genre > b.genre) ? 1 : -1

	});
	filterMovies();
}

$("#sortByGenre").click(() => sortMoviesGenre())

function sortMoviesRating() {
	drawnMovies.sort(function (a, b) {
		return (a.rating < b.rating) ? 1 : -1
	});
	filterMovies();
}

$("#sortByRating").click(() => sortMoviesRating());
$("#clearFilters").click(() => {
	drawnMovies = moviesArray;
	$("#movieSearch").val("");
	$("input[name='sortRating']").attr("checked", false);
	genreFilter = false;
	ratingFilter = false;
	titleFilter = false;
	drawMovies(drawnMovies);
});

$("#addMovieSearchButton").click(() => {
	let movieTitle = $("#addMovieSearch").val().split(" ").join("+").toLowerCase()
	console.log(movieTitle);
	fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${movieTitle}`)
		.then(result => result.json())
		.then(data => {
			console.log(data)
			$("#addTitle").val(data.Title);
			$("#addDirector").val(data.Director);
			$("#addYear").val(data.Year);
			$("#addGenre").val(data.Genre);
			$("#addActors").val(data.Actors);
			$("#addPlot").val(data.Plot);
			$("#poster").val(data.Poster)

		})
		.catch(error => console.log(error));
})
