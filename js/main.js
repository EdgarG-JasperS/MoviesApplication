"use strict";
const url = "https://rough-harvest-liver.glitch.me/movies";
let drawMovies = moviesList => {
	$(".movie-collection").html("");
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
		$(".movie-collection").append(`
			<div id="movie${movieObject.id}" class="card mx-3 my-3">
				<div class="card-header bg-dark">
					<a href="#card${movieObject.id}" data-bs-toggle="collapse">
						<img src="${movieObject.poster}" class="card-img-top" alt="${movieObject.title} movie poster">
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
		let deleteButton = document.getElementById(`delete${movieObject.id}`)
		deleteButton.addEventListener("click", () => {
			deleteButton.setAttribute("disabled", true);
			fetch(url + "/" + movieObject.id, {
				method: "DELETE", headers: {'Content-Type': 'application/json'}
			})
				.then(() => {
					$(".movie-collection").html("");
					getMovies();
				})
				.catch(error => console.log(error));
		});
	});
}
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
let getMovies = () => fetch(url)
	.then(response => response.json())
	.then(data => {
		moviesArray.length = 0;
		genreList.length = 0;
		$("#genreList").html("")
		data.forEach(movie => moviesArray.push(movie));
		drawnMovies = moviesArray;
		filterMovies();
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
$("#addRatingLabel1").hover(() => {
	$("#addRatingLabel1").addClass("hoverStars");
}, () => {
	$("#addRatingLabel1").removeClass("hoverStars");
});
$("#addRatingLabel2").hover(() => {
	$("#addRatingLabel1").addClass("hoverStars");
	$("#addRatingLabel2").addClass("hoverStars");
}, () => {
	$("#addRatingLabel1").removeClass("hoverStars");
	$("#addRatingLabel2").removeClass("hoverStars");
});
$("#addRatingLabel3").hover(() => {
	$("#addRatingLabel1").addClass("hoverStars");
	$("#addRatingLabel2").addClass("hoverStars");
	$("#addRatingLabel3").addClass("hoverStars");
}, () => {
	$("#addRatingLabel1").removeClass("hoverStars");
	$("#addRatingLabel2").removeClass("hoverStars");
	$("#addRatingLabel3").removeClass("hoverStars");
});
$("#addRatingLabel4").hover(() => {
	$("#addRatingLabel1").addClass("hoverStars");
	$("#addRatingLabel2").addClass("hoverStars");
	$("#addRatingLabel3").addClass("hoverStars");
	$("#addRatingLabel4").addClass("hoverStars");
}, () => {
	$("#addRatingLabel1").removeClass("hoverStars");
	$("#addRatingLabel2").removeClass("hoverStars");
	$("#addRatingLabel3").removeClass("hoverStars");
	$("#addRatingLabel4").removeClass("hoverStars");
});
$("#addRatingLabel5").hover(() => {
	$("#addRatingLabel1").addClass("hoverStars");
	$("#addRatingLabel2").addClass("hoverStars");
	$("#addRatingLabel3").addClass("hoverStars");
	$("#addRatingLabel4").addClass("hoverStars");
	$("#addRatingLabel5").addClass("hoverStars");
}, () => {
	$("#addRatingLabel1").removeClass("hoverStars");
	$("#addRatingLabel2").removeClass("hoverStars");
	$("#addRatingLabel3").removeClass("hoverStars");
	$("#addRatingLabel4").removeClass("hoverStars");
	$("#addRatingLabel5").removeClass("hoverStars");
});
$("input[name='addRating']").click(() => {
	let selectedRating = $("input[name='addRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='addRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='addRating'][value=${i}]`).parent().removeClass("goldStar");
	}
});
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
		.then(() => {
			$(".movie-collection").html("");
			getMovies();
			$("#addMovieButton").attr("disabled", false);
			$("#addMovieSearch").val("");
			$("#addTitle").val("");
			$("#addDirector").val("");
			$("#addYear").val("");
			$("#addGenre").val("");
			$("#addActors").val("");
			$("#addPlot").val("");
			$("#poster").val("");
			$("input[name='addRating']:checked").attr("checked", false);
			$("input[name='addRating']").parent().removeClass("goldStar");
		})
		.catch(error => {
			console.log(error);
			$("#addMovieButton").attr("disabled", false);
		});
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
			$(`input[value=${element.rating}][name="editRating"]`).attr("checked", true);
			for (let i = 1; i <= Number(element.rating); i++) {
				$(`input[name='editRating'][value=${i}]`).parent().addClass("goldStar");
			}
			for (let i = 5; i > Number(element.rating); i--) {
				$(`input[name='editRating'][value=${i}]`).parent().removeClass("goldStar");
			}
			$('#editID').val(element.id);
			$("#editPoster").val(element.poster);
		});
	});
});
$("#editRatingLabel1").hover(() => {
	$("#editRatingLabel1").addClass("hoverStars");
}, () => {
	$("#editRatingLabel1").removeClass("hoverStars");
});
$("#editRatingLabel2").hover(() => {
	$("#editRatingLabel1").addClass("hoverStars");
	$("#editRatingLabel2").addClass("hoverStars");
}, () => {
	$("#editRatingLabel1").removeClass("hoverStars");
	$("#editRatingLabel2").removeClass("hoverStars");
});
$("#editRatingLabel3").hover(() => {
	$("#editRatingLabel1").addClass("hoverStars");
	$("#editRatingLabel2").addClass("hoverStars");
	$("#editRatingLabel3").addClass("hoverStars");
}, () => {
	$("#editRatingLabel1").removeClass("hoverStars");
	$("#editRatingLabel2").removeClass("hoverStars");
	$("#editRatingLabel3").removeClass("hoverStars");
});
$("#editRatingLabel4").hover(() => {
	$("#editRatingLabel1").addClass("hoverStars");
	$("#editRatingLabel2").addClass("hoverStars");
	$("#editRatingLabel3").addClass("hoverStars");
	$("#editRatingLabel4").addClass("hoverStars");
}, () => {
	$("#editRatingLabel1").removeClass("hoverStars");
	$("#editRatingLabel2").removeClass("hoverStars");
	$("#editRatingLabel3").removeClass("hoverStars");
	$("#editRatingLabel4").removeClass("hoverStars");
});
$("#editRatingLabel5").hover(() => {
	$("#editRatingLabel1").addClass("hoverStars");
	$("#editRatingLabel2").addClass("hoverStars");
	$("#editRatingLabel3").addClass("hoverStars");
	$("#editRatingLabel4").addClass("hoverStars");
	$("#editRatingLabel5").addClass("hoverStars");
}, () => {
	$("#editRatingLabel1").removeClass("hoverStars");
	$("#editRatingLabel2").removeClass("hoverStars");
	$("#editRatingLabel3").removeClass("hoverStars");
	$("#editRatingLabel4").removeClass("hoverStars");
	$("#editRatingLabel5").removeClass("hoverStars");
});
$("input[name='editRating']").click(() => {
	let selectedRating = $("input[name='editRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='editRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='editRating'][value=${i}]`).parent().removeClass("goldStar");
	}
});
$("#saveButton").click(() => {
	$("#saveButton").attr("disabled", true);
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
		.then(() => {
			$(".movie-collection").html("");
			getMovies();
			$("#saveButton").attr("disabled", false);
			$("#editTitle").val("");
			$("#editDirector").val("");
			$("#editYear").val("");
			$("#editGenre").val("");
			$("#editActors").val("");
			$("#editPlot").val("");
			$("#editPoster").val("");
			$("input[name='editRating']:checked").attr("checked", false);
			$("#editID").val("");
			$("input[name='editRating']").parent().removeClass("goldStar");
		})
		.catch(error => {
			console.log(error);
			$("#saveButton").attr("disabled", false);
		});
});
let moviesArray = [];
let genreList = [];
let genreFilter = false;
let ratingFilter = false;
let titleFilter = false;
let selectedGenre = "";
getMovies();
let drawnMovies = [];
let searchMovie = () => {
	titleFilter = true;
	filterMovies();
}
$("#oneStarFilter").hover(() => {
	$("#oneStarFilter").addClass("hoverStars");
}, () => {
	$("#oneStarFilter").removeClass("hoverStars");
});
$("#twoStarFilter").hover(() => {
	$("#oneStarFilter").addClass("hoverStars");
	$("#twoStarFilter").addClass("hoverStars");
}, () => {
	$("#oneStarFilter").removeClass("hoverStars");
	$("#twoStarFilter").removeClass("hoverStars");
});
$("#threeStarFilter").hover(() => {
	$("#oneStarFilter").addClass("hoverStars");
	$("#twoStarFilter").addClass("hoverStars");
	$("#threeStarFilter").addClass("hoverStars");
}, () => {
	$("#oneStarFilter").removeClass("hoverStars");
	$("#twoStarFilter").removeClass("hoverStars");
	$("#threeStarFilter").removeClass("hoverStars");
});
$("#fourStarFilter").hover(() => {
	$("#oneStarFilter").addClass("hoverStars");
	$("#twoStarFilter").addClass("hoverStars");
	$("#threeStarFilter").addClass("hoverStars");
	$("#fourStarFilter").addClass("hoverStars");
}, () => {
	$("#oneStarFilter").removeClass("hoverStars");
	$("#twoStarFilter").removeClass("hoverStars");
	$("#threeStarFilter").removeClass("hoverStars");
	$("#fourStarFilter").removeClass("hoverStars");
});
$("#fiveStarFilter").hover(() => {
	$("#oneStarFilter").addClass("hoverStars");
	$("#twoStarFilter").addClass("hoverStars");
	$("#threeStarFilter").addClass("hoverStars");
	$("#fourStarFilter").addClass("hoverStars");
	$("#fiveStarFilter").addClass("hoverStars");
}, () => {
	$("#oneStarFilter").removeClass("hoverStars");
	$("#twoStarFilter").removeClass("hoverStars");
	$("#threeStarFilter").removeClass("hoverStars");
	$("#fourStarFilter").removeClass("hoverStars");
	$("#fiveStarFilter").removeClass("hoverStars");
});
let searchRating = () => {
	ratingFilter = true;
	let selectedRating = $("input[name='sortRating']:checked").val();
	for (let i = 1; i <= Number(selectedRating); i++) {
		$(`input[name='sortRating'][value=${i}]`).parent().addClass("goldStar");
	}
	for (let i = 5; i > Number(selectedRating); i--) {
		$(`input[name='sortRating'][value=${i}]`).parent().removeClass("goldStar");
	}
	filterMovies();
}
let sortMoviesName = () => {
	drawnMovies.sort((a, b) => {
		return (a.title > b.title) ? 1 : -1
	});
	filterMovies()
}
$("#sortByName").click(() => sortMoviesName())
let sortMoviesGenre = () => {
	drawnMovies.sort(function (a, b) {
		return (a.genre > b.genre) ? 1 : -1
	});
	filterMovies();
}
$("#sortByGenre").click(() => sortMoviesGenre())
let sortMoviesRating = () => {
	drawnMovies.sort((a, b) => {
		return (a.rating < b.rating) ? 1 : -1
	});
	filterMovies();
}
$("#sortByRating").click(() => sortMoviesRating());
$("#clearFilters").click(() => {
	drawnMovies = moviesArray;
	$("#movieSearch").val("");
	$("input[name='sortRating']").attr("checked", false);
	$("input[name='sortRating']").parent().removeClass("goldStar");
	genreFilter = false;
	ratingFilter = false;
	titleFilter = false;
	drawMovies(drawnMovies);
});
$("#addMovieSearchButton").click(() => {
	let movieTitle = $("#addMovieSearch").val().split(" ").join("+").toLowerCase()
	fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${movieTitle}`)
		.then(result => result.json())
		.then(data => {
			$("#addTitle").val(data.Title);
			$("#addDirector").val(data.Director);
			$("#addYear").val(data.Year);
			$("#addGenre").val(data.Genre);
			$("#addActors").val(data.Actors);
			$("#addPlot").val(data.Plot);
			$("#poster").val(data.Poster)
		})
		.catch(error => console.log(error));
});