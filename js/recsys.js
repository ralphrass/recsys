function recomendarItemItem(userId){

	if (!userId){

		userId = document.getElementById("user").value;
	}

	montarMatrizDeRatings();
	montarMatrizDeSimilaridades(MaxMovieId, Movies.length, ItemUserMatrix, calcularCosseno);
	var previsoes = preverNotasItemItem(userId);
	mostrarRecomendacoes(previsoes);
}

function recomendarUserUser(userId){

	if (!userId){

		userId = document.getElementById("user").value;
	}

	montarMatrizDeRatings();
	montarMatrizDeSimilaridades(NumUsers, NumUsers, UserItemMatrix, pearsonCorrelation);
	var previsoes = preverNotasUserUser(userId);
	mostrarRecomendacoes(previsoes);
}

/*
	Demora cerca de 10 minutos para computar toda a matriz.
	Uma possível solução é limitar o número de similares. Exemplo: 500 vizinhos ao invés de usar os 10 mil.
*/
function montarMatrizDeSimilaridades(NrSimMatrixRows, NrSimMatrixCols, TargetMatrix, SimFunction){
	
	MatrizDeSimilaridades = [];

	for (var i=0; i<=NrSimMatrixRows; i++){

		MatrizDeSimilaridades[i] = new Array();
	}

	for (var i=1; i<(NrSimMatrixCols-1); i++){

		if (i%200 == 0){

			console.log("Calculando similaridade "+i+" com os demais ");
		}

		for (var j=i+1; j<NrSimMatrixCols; j++){

			//console.log("Calculando similaridade "+i+" com "+j);

			if (MatrizDeSimilaridades[i].length > kNNLimitItems){

				continue;
			}
			
			var similaridadeIJ = 0;

			var vetorA = TargetMatrix[i];
			var vetorB = TargetMatrix[j];

			similaridadeIJ = SimFunction(vetorA, vetorB, i, j);
			MatrizDeSimilaridades[i][j] = similaridadeIJ;
		}
	}

	//console.log(MatrizDeSimilaridades);
}

function montarMatrizDeRatings(){

	if (UserItemMatrix.length > 1 && ItemUserMatrix.length > 1){

		return;
	}

	for (var i=0; i<NumUsers; i++){

		UserItemMatrix[i] = new Array();
	}

	for (var i=0; i<MaxMovieId; i++){

		ItemUserMatrix[i] = new Array();
	}

	for (var i=1; i<Ratings.length; i++){

		var usuarioId = Ratings[i][0];
		var filmeId = Ratings[i][1];
		var avaliacao = Ratings[i][2];

		if (usuarioId == 668){ //ignora o último usuário (5 mil ratings)
			break;
		}

		if (ItemUserMatrix[parseInt(filmeId)] == undefined) {
			console.log("Continuação em "+i);
			continue;
		}

		//console.log("Rating "+i+" Usuário "+parseInt(Ratings[i][0])+" deu nota "+Ratings[i][2]);

		UserItemMatrix[parseInt(usuarioId)][parseInt(filmeId)] = parseFloat(avaliacao);
		ItemUserMatrix[parseInt(filmeId)][parseInt(usuarioId)] = parseFloat(avaliacao);
	}
}

/*function topRatedMovies(){

	montarMatrizDeRatings();

	for (movie in ItemUserMatrix){

		//console.log(Movies[movie]);

		if (movie == 0) continue;
		if (Movies[movie] == undefined) continue;

		var k=0;
		var totalRatings = 0;

		for (user in ItemUserMatrix[movie]) {

			k++;
		}

		if (k == 0) continue;

		var newMovie = new Object();
		newMovie.id = movie;
		newMovie.title = Movies[movie][1];
		newMovie.ratings = k;
		newMovie.averageRating = ItemUserMatrix[movie].reduce(function(a,b){return a + b}) / k;

		TopRatedMovies[movie] = newMovie;
	}

	TopRatedMovies.sort(function(a,b){
		return a.title.localeCompare(b.title);
	});
}*/
