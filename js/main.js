const url = "https://rough-harvest-liver.glitch.me/movies";
let drawMovies = moviesList => {
	$(".container").html("");
	moviesList.forEach(movieObject => {
		let movieDiv = document.createElement("div");
		movieDiv.setAttribute("id", "movie" + movieObject.id);
		let movieTitle = document.createElement("h3");
		movieTitle.innerText = movieObject.title;
		movieDiv.append(movieTitle);
		let movieRating = document.createElement("p");
		let rating = Number(movieObject.rating);
		for (let i = 0; i < rating; i++) {
			movieRating.innerHTML += "&#9733;";
		}
		for (let i = 0; i < 5 - rating; i++) {
			movieRating.innerHTML += "&#9734;";
		}
		movieDiv.append(movieRating);
		let deleteButton = document.createElement("button");
		deleteButton.setAttribute("id", "delete" + movieObject.id);
		deleteButton.innerText = "Delete This Movie";
		movieDiv.append(deleteButton);
		$(".container").append(movieDiv);
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
let getMovies = () => fetch(url)
	.then(response => response.json())
	.then(data => {
		moviesArray.length = 0;
		data.forEach(movie => moviesArray.push(movie));
		drawMovies(moviesArray);
		data.forEach(movie => {
			if(!genreList.includes(movie.genre)){
				genreList.push(movie.genre);
			}
		})
		genreList.forEach(genre => {
			let genreButton = document.createElement("button");
			genreButton.setAttribute("class", "btn btn-link dropdown-item");
			genreButton.innerText = genre;
			$('#genreList').append(genreButton);
			genreButton.addEventListener("click", () => {
				let matchingMovieGenre = []
				moviesArray.forEach(movie => {
					if(movie.genre === genre){
						matchingMovieGenre.push(movie)
					}
				})
				drawMovies(matchingMovieGenre)
			})
		})
		console.log(genreList)
		$("#loading").attr('style', 'display: none');
	})
	.catch(err => console.log(err));
$("#addMovieButton").click(function () {
	$("#addMovieButton").attr("disabled", true);
	fetch(url, {
		method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#title").val(),
			director: "",
			year: "",
			genre: "",
			actors: "",
			plot: "",
			rating: $("input[name='rating']:checked").val(),
			poster: ""
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
			$('#editRating').val(element.rating);
			$('#editID').val(element.id);
		});
	});
});
$("#saveButton").click(() => {
	$("#saveButton").attr("disabled", true);
	fetch(`${url}/${$('#editID').val()}`, {
		method: "PUT", headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
			title: $("#editTitle").val(),
			director: "",
			year: "",
			genre: "",
			actors: "",
			plot: "",
			rating: $("input[name='rating']:checked").val(),
			poster: ""
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
getMovies();



function searchMovie() {
	let searchInput = $("#movieSearch").val();
	let filter = searchInput.toUpperCase();
	console.log(filter)
	let filteredMovies = [];
	moviesArray.forEach(function (movie) {
		if (movie.title.toUpperCase().includes(filter)) {
			filteredMovies.push(movie);
			console.log(filteredMovies);
		}
	});
	drawMovies(filteredMovies)
}

function searchRating() {
	let searchInput = $("input[name='sortRating']:checked").val();
	let filteredMovies = [];
	moviesArray.forEach(function (movie) {
		if (movie.rating.includes(searchInput)) {
			filteredMovies.push(movie);
			console.log(filteredMovies);
		}
	});
	drawMovies(filteredMovies)
}

function sortMoviesName() {
	moviesArray.sort(function (a, b) {
		return (a.title > b.title) ? 1 : -1

	})
	drawMovies(moviesArray)
}

$("#sortByName").click(() => sortMoviesName())

function sortMoviesGenre() {
	moviesArray.sort(function (a, b) {
		return (a.genre > b.genre) ? 1 : -1

	})
	drawMovies(moviesArray)
}

$("#sortByGenre").click(() => sortMoviesGenre())

function sortMoviesRating() {
	moviesArray.sort(function (a, b) {
		return (a.rating < b.rating) ? 1 : -1

	})
	drawMovies(moviesArray)
}

$("#sortByRating").click(() => sortMoviesRating())