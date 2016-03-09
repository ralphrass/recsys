function preverNotasUserUser(userId){

	var previsoes = [];
	var usersRatingsMatrix = [];

	console.log("Prevendo notas...");

	targetUserRatings = lerAvaliacoes(userId);

	for (var movie in Movies){

		//if (usuarioNaoAvaliou(targetUserRatings, Movies[movie][0])){

			var somaSimilaridadesNumerador = 0, somaSimilaridadesDenominador = 0;
			
			for (var user in ItemUserMatrix[movie]){

				var similarity = (userId < user)?MatrizDeSimilaridades[userId][user]:MatrizDeSimilaridades[user][userId];
				
				if (similarity != undefined && similarity != 0){

					var currentUserRatings = usersRatingsMatrix[user];

					if (currentUserRatings == undefined){

						currentUserRatings = lerAvaliacoes(user);
						usersRatingsMatrix[user] = currentUserRatings;
					}

					somaSimilaridadesNumerador += similarity * (ItemUserMatrix[movie][user] - currentUserRatings[currentUserRatings.length-1]);
					somaSimilaridadesDenominador += similarity;
				}
			}

			if (somaSimilaridadesNumerador > 0){

				var rating = targetUserRatings[targetUserRatings.length-1] + (somaSimilaridadesNumerador / somaSimilaridadesDenominador);				
				var previsao = new Object();
				previsao.filmeTitulo = Movies[movie][1];
				previsao.rating = rating;
				previsao.userRating = ItemUserMatrix[movie][userId];

				previsoes[Movies[movie][0]] = previsao;
			}
		//}
	}

	previsoes.sort(function(a,b){

		if (a.rating > b.rating){
			return -1;
		} else if (a.rating < b.rating){
			return 1;
		}
		return 0;
	});

	//console.log(previsoes);

	return previsoes;
}

function pearsonCorrelation(vectorA, vectorB, userA, userB){

	var totalNumerador = 0, totalDenominador1 = 0, totalDenominador2 = 0;
	var similaridadeIJ = 0;

	for (var movie in vectorA){

		if (vectorB[movie] != undefined){

			var mediaUsuarioA = MediasUsuarios[userA];
			var mediaUsuarioB = MediasUsuarios[userB];

			if (mediaUsuarioA == undefined){
			
				var currentUserRatings = lerAvaliacoes(userA);
				mediaUsuarioA = currentUserRatings[currentUserRatings.length-1];
				MediasUsuarios[userA] = mediaUsuarioA;
			}

			if (mediaUsuarioB == undefined){
			
				var currentUserRatings = lerAvaliacoes(userB);
				mediaUsuarioB = currentUserRatings[currentUserRatings.length-1];
				MediasUsuarios[userB] = mediaUsuarioB;
			}

			totalNumerador += (vectorA[movie] - mediaUsuarioA) * (vectorB[movie] - mediaUsuarioB);
			totalDenominador1 += Math.pow((vectorA[movie] - mediaUsuarioA), 2);
			totalDenominador2 += Math.pow((vectorB[movie] - mediaUsuarioB), 2);
		}
	}

	if (totalNumerador > 0){

		similaridadeIJ = totalNumerador / (Math.sqrt(totalDenominador1) * Math.sqrt(totalDenominador2));
	}

	return similaridadeIJ;
}