function preverNotasItemItem(userId){
	
	var previsoes = [];

	targetUserRatings = lerAvaliacoes(userId);

	for (var filme in Movies){

		//if (usuarioNaoAvaliou(targetUserRatings, Movies[filme][0])){

			var somaSimilaridadesNumerador = 0, somaSimilaridadesDenominador = 0;

			for (var i=0; i<targetUserRatings.length; i++){

				if (MatrizDeSimilaridades[Movies[filme][0]] != undefined && MatrizDeSimilaridades[Movies[filme][0]][targetUserRatings[i].id] != undefined){

					somaSimilaridadesNumerador += MatrizDeSimilaridades[Movies[filme][0]][targetUserRatings[i].id] * targetUserRatings[i].rating;
					somaSimilaridadesDenominador += MatrizDeSimilaridades[Movies[filme][0]][targetUserRatings[i].id];	
				}
			}

			if (somaSimilaridadesNumerador > 0){

				var previsao = new Object();
				previsao.filmeTitulo = Movies[filme][1];
				previsao.rating = somaSimilaridadesNumerador / somaSimilaridadesDenominador;
				previsoes[Movies[filme][0]] = previsao;
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

function calcularCosseno(vetorA, vetorB, a, b){

	var totalNumerador = 0, totalDenominador1 = 0, totalDenominador2 = 0;
	var similaridadeIJ = 0;

	for (var usuario in vetorA){
				
		if (vetorB != undefined && vetorB[usuario] != undefined){

			var mediaUsuario = MediasUsuarios[usuario];

			if (mediaUsuario == undefined){
			
				currentUserRatings = lerAvaliacoes(usuario);
				mediaUsuario = currentUserRatings[currentUserRatings.length-1];
				MediasUsuarios[usuario] = mediaUsuario;
			}

			totalNumerador += (vetorA[usuario] - mediaUsuario) * (vetorB[usuario] - mediaUsuario);
			totalDenominador1 += Math.pow((vetorA[usuario] - mediaUsuario), 2);
			totalDenominador2 += Math.pow((vetorB[usuario] - mediaUsuario), 2);
		}
	}

	if (totalNumerador > 0){

		similaridadeIJ = totalNumerador / (Math.sqrt(totalDenominador1) * Math.sqrt(totalDenominador2));
	}

	return similaridadeIJ;
}