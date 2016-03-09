function itemUserMatches(userProfile){

	var matches = new Array();

	for (itemProfile in ItemProfileMatrix){

		if (ItemProfileMatrix[itemProfile].genreProfile == undefined){
			continue;
		}

		var match = new Object();
		match.movieId = ItemProfileMatrix[itemProfile].movieId;
		match.val = math.dot(ItemProfileMatrix[itemProfile].genreProfile, userProfile);
		match.filmeTitulo = ItemProfileMatrix[itemProfile].movieTitle;

		matches.push(match);
	}

	matches.sort(function(a, b){
		if (a.val > b.val){
			return -1;
		} else if (a.val < b.val){
			return 1;
		} else {
			return 0;
		}
	});

	return matches;
}

function buildUserProfile(userId){

	var targetUserRatings = lerAvaliacoes(userId);
	var userProfile = math.zeros(MovieGenres.length);

	for (userRating in targetUserRatings){

		var movieId = Number(targetUserRatings[userRating].id);
		var rating = targetUserRatings[userRating].rating;

		var movieProfile = ItemProfileMatrix.filter(function(obj){
			return (obj.movieId == movieId);
		});

		if (rating > UserRatingCBFThreshold){

			userProfile = math.add(userProfile, movieProfile[0].genreProfile);

		} else if (rating < UserRatingCBFThreshold) {

			userProfile = math.subtract(userProfile, movieProfile[0].genreProfile);
		}
	}

	return userProfile;
}

function buildItemProfileMatrix(){

	MovieGenres = buildMovieGenresVector(1, Movies.length);

	for (var i=1; i<Movies.length; i++){

		var movieProfile = new Object();
		movieProfile.genreProfile = Array(MovieGenres.length).fill(0);
		movieProfile.movieId = Number(Movies[i][0]);
		movieProfile.movieTitle = Movies[i][1];

		var currentMovieGenres = buildMovieGenresVector(i, i+1);

		for (var j=0; j<MovieGenres.length; j++){			

			if (currentMovieGenres.indexOf(MovieGenres[j]) != -1){

				movieProfile.genreProfile[j] = 1;
				break; // ATENTION! HERE WE ARE FORCING ONLY ONE GENRE PER MOVIE!

			} else {

				movieProfile.genreProfile[j] = 0;
			}
		}

		ItemProfileMatrix[i] = movieProfile;
	}
}

function buildMovieGenresVector(Start, Length){
	
	var genres = [];

	for (var i=Start; i<Length; i++){

		var strMovieMovieGenres = Movies[i][2];

		if (strMovieMovieGenres == "(no genres listed)" || strMovieMovieGenres == undefined){

			continue;
		}

		var arrMovieMovieGenres = strMovieMovieGenres.split("|");

		for (var genre in arrMovieMovieGenres){

			if (genres.indexOf(arrMovieMovieGenres[genre]) == -1){

				genres.push(arrMovieMovieGenres[genre]);
			}
		}
	}

	genres.sort(function(a, b){

		return a.localeCompare(b);
	});

	return genres;
}