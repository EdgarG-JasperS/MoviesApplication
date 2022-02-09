const url = "https://rough-harvest-liver.glitch.me/movies"
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let html = ''
        for(let i = 0; i < data.length; i++){
                $('body').append(`${data[i].title}`)
        }
        $("#loading").attr('style', 'display: none')


    })
    .catch(err => console.log(err))
$("addMovieButton").submit(function(e){
        e.preventDefault();
        $(this).submit();
        // fetch(url, {
        //         method: 'POST'
        // })
})
let movieBody = {
        title: $("#title").val(),
        rating: $("#")
}