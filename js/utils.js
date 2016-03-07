function handleFiles(files, type){	
	if (type == 1){

		var fileMovies = document.getElementById('movies').files[0];
		Papa.parse(fileMovies, {
			complete: function(results) {
				Movies = results.data;
				console.log("movie file readed");
			}
		} );
	}
	
	if (type == 2){

		var fileRatings = document.getElementById('ratings').files[0];
		Papa.parse(fileRatings, {
			complete: function(results) {
				Ratings = results.data;
				console.log("ratings file readed");
			} 
		} );
	}
}

function getUserRating(targetUserRatings, movieId){

	for (var i=0; i<targetUserRatings.length; i++){

		if (targetUserRatings[i].id == movieId){

			return targetUserRatings[i].rating;
		}
	}

	return null;
}

function usuarioNaoAvaliou(targetUserRatings, filmeId){

	for (var i=0; i<targetUserRatings.length; i++){

		if (targetUserRatings[i].id == filmeId){

			return false;
		}
	}

	return true;
}

function obterAvaliacaoDoFilme(ratings, filmeId){

	var filme = null;

	for (var i=0; i<(ratings.length-1); i++){

		if (ratings[i].id == filmeId){

			filme = new Object();
			filme.rating = ratings[i].rating;
		}
	}

	return filme;
}

function arredondar(valor){

	return Math.round(valor * ROUND) / ROUND;
}

function isTopUser(similaridade, topUsers){

	var menorSoFar = null;

	for (var i=0; i<topUsers.length; i++){

		if (similaridade > topUsers[i].similaridade){

			if ((menorSoFar == null) || (menorSoFar != null && topUsers[i].similaridade < menorSoFar.similaridade)) {

				menorSoFar = topUsers[i];
			}
		}
	}

	return menorSoFar;
}

function lerAvaliacoes(userId){

	var moviesRated = new Array();
	var totalNotas = 0;

	for (var i=1; i<Ratings.length; i++){

		if (Ratings[i][0] == userId){

			var item = novoItem(Ratings[i]);
			totalNotas += Number(item.rating);
			moviesRated.push(item);

		} else if (moviesRated.length > 1){ //as ratings são sequenciais

			break;
		}
	}

	var media = Number(totalNotas / moviesRated.length);
	moviesRated.push(media);

	return moviesRated;
}

function novoItem(input){

	var item = new Object();
	item.id = input[1];
	item.rating = Number(input[2]);
	titleAndGenres = getTitleAndGenres(item.id).split("%");
	item.titulo = titleAndGenres[0];
	item.genres = titleAndGenres[1];

	return item;
}

function getTitleAndGenres(id){

	for (var i=1; i<Movies.length; i++){

		if (Movies[i][0] == id){

			return Movies[i][1]+"%"+Movies[i][2];
		}
	}	
}

function salvarTopUser(userId, similaridade, ratings){

	var topUser = new Object();

	topUser.userId = userId;
	topUser.similaridade = similaridade;
	topUser.ratings = ratings;

	return topUser;
}

function ordenarPrevisoes(previsoes){

	previsoes.sort(function(a,b){

		if (a.rating > b.rating){
			return -1;
		} else if (a.rating < b.rating){
			return 1;
		}
		return 0;
	});

	return previsoes;
}