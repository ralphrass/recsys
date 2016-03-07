/*
Quando tem apenas 01 rating em comum o resultado do Pearson é igual a 1.
Ou seja, nem sempre um Pearson alto é bom.
Percorre kNNLimit usuários e seleciona kNN usuários, rejeitando grau de similaridade = 1 e intersecções vazias
*/
/*function recomendarUsuarioUsuario(userId){

	if (!userId){

		userId = document.getElementById("user").value;
	}

	var targetUserRatings = lerAvaliacoes(userId);
	var users = new Array(), topUsers = new Array();
	var currentUser = -1;

	for (var i=1; i<kNNLimit; i++){
		
		while (users.indexOf(currentUser) != -1){

			currentUser = parseInt(Math.random() * NumUsers);

			if (currentUser == userId) currentUser = -1; //Evita comparar o usuário com ele mesmo
		}

		users.push(currentUser);
		
		var currentUserRatings = lerAvaliacoes(currentUser);
		var similaridade = calcularPearson(targetUserRatings, currentUserRatings);

		if (!(similaridade > -1) || similaridade > 0.9) { //rejeita itens sem intersecção e similaridades muito "perfeitas" (1 item em intersecção)

			continue;
		}

		var userObject = salvarTopUser(currentUser, similaridade, currentUserRatings);

		if (topUsers.length < kNN){

			topUsers.push(userObject);

		} else {

			usuarioParaRemover = isTopUser(similaridade, topUsers);

			if (usuarioParaRemover != null){

				topUsers.splice(topUsers.indexOf(usuarioParaRemover), 1);
				topUsers.push(userObject);
			}
		}
	}

	var previsoes = recommendItemsUserUser(targetUserRatings, topUsers);
	var previsoesOrdenadas = ordenarPrevisoes(previsoes);

	mostrarRecomendacoes(previsoesOrdenadas);
}*/

/*function calcularPearson(targetUserRatings, currentUserRatings){

	var somaAvaliacoes = 0, somaUsuarioA = 0, somaUsuarioB = 0;

	//Similaridade
	for (var k=0; k<targetUserRatings.length; k++){ //filmes do usuário "A"

		var filme = obterAvaliacaoDoFilme(currentUserRatings, targetUserRatings[k].id);			

		if (filme != null){ //usuário "B" avaliou o filme (intersecção)

			//console.log(filme.rating + " "+targetUserRatings[k].rating)

			var termoUsuarioA = Number(targetUserRatings[k].rating) - targetUserRatings[targetUserRatings.length-1];
			var termoUsuarioB = Number(filme.rating) - currentUserRatings[currentUserRatings.length-1]

			somaAvaliacoes += termoUsuarioA * termoUsuarioB;
			somaUsuarioA += Math.pow(termoUsuarioA, 2);
			somaUsuarioB += Math.pow(termoUsuarioB, 2);
		}
	}

	var similaridade = somaAvaliacoes / (Math.sqrt(somaUsuarioA) * Math.sqrt(somaUsuarioB));

	return similaridade;
}*/

function recommendItemsUserUser(targetUserRatings, topUsers){

	var previsoes = new Array();

	for (var i=1; i<Movies.length; i++){

		var somaNumerador = 0, somaDenominador = 0;

		for (var j=0; j<topUsers.length; j++){

			for (var r=0; r<(topUsers[j].ratings.length-1); r++){

				//if (usuarioNaoAvaliou(targetUserRatings, Movies[i][0])){

					if (topUsers[j].ratings[r].id == Movies[i][0]){

						somaNumerador += topUsers[j].similaridade * (Number(topUsers[j].ratings[r].rating) - topUsers[j].ratings[topUsers[j].ratings.length-1]);
						somaDenominador += topUsers[j].similaridade;
					}
				//}				
			}
		}

		//previsão da nota que o usuário vai dar para o filme "i"
		if (somaNumerador > 0){

			var p = new Object();
			p.filmeId = Movies[i][0];
			p.filmeTitulo = Movies[i][1];
			p.rating = targetUserRatings[targetUserRatings.length-1] + (somaNumerador / somaDenominador);

			previsoes.push(p);
		}
	}

	return previsoes;
}

function preverNotasUserUser(userId){

	var previsoes = [];
	var usersRatingsMatrix = [];

	console.log("Prevendo notas...");

	targetUserRatings = lerAvaliacoes(userId);

	for (var movie in Movies){

		if (usuarioNaoAvaliou(targetUserRatings, Movies[movie][0])){

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
				previsoes[Movies[movie][0]] = previsao;	
			}
		}
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