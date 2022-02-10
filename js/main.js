const url = "https://rough-harvest-liver.glitch.me/movies"
let drawMovies = () => fetch(url)
	.then(response => response.json())
	.then(data => {
		let html = ''
		for (let i = 0; i < data.length; i++) {
			$('.container').append(`<div>
				${data[i].title}
				<button id="${data[i].id}delete" data-id=${data[i].id}>Delete This Movie</button>
				</div>`);
			$(`#${data[i].id}delete`).click(() => {
				$(`#${data[i].id}delete`).attr("disabled", true);
				fetch(url + "/" + data[i].id, {
					method: "DELETE", headers: {'Content-Type': 'application/json'}
				})
					.then(response => {
						$(".container").html("");
						drawMovies();
					})
					.catch(error => console.log(error));
			});
			moviesArray.push(data[i]);
		}
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
			drawMovies();
			$("#addMovieButton").attr("disabled", false);
		})
		.catch(error => console.log(error));
});

$("#editMovieButton").click(() => {
	moviesArray.forEach((element) => {
		let movieButton = document.createElement("button");
		movieButton.setAttribute("class", "btn btn-link dropdown-item");
		movieButton.innerText = element.title;
		$('#movieList').append(movieButton);
		movieButton.addEventListener('click', () =>{
			$('#editTitle').val(element.title);
			$('#editID').val(element.id);
		});
	});
});

$("#saveButton").click(() => {
	$("#saveButton").attr("disabled", true);
	fetch(url + "/" + $('#editID').val(), {
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
			drawMovies();
			$("#saveButton").attr("disabled", false);
		})
		.catch(error => console.log(error));
});

let moviesArray = [];
drawMovies();

let movieBody = {
	title: $("#title").val(), rating: $("#")
}