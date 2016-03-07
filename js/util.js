var fileMovies;
var fileRatings;

function handleFiles(files, type){
	
	if (type == 1){

		fileMovies = document.getElementById('movies').files[0];
		console.log(fileMovies);
	}
	
	if (type == 2){

		fileRatings = document.getElementById('ratings').files[0];
	}
}