function mostrarRecomendacoes(previsoesOrdenadas){

	var content = "<ol>";

	for (var i=0; i<MaxRecomendacoes; i++){

		content += "<li>"+previsoesOrdenadas[i].filmeTitulo+" ["+arredondar(previsoesOrdenadas[i].rating)+"]</li>";
	}

	content += "<ol>";

	document.getElementById("recomendacoes").innerHTML = content;
}

function mostrarAvaliacoes(usuario, ratings){

	moviesRated = lerAvaliacoes(document.getElementById(usuario).value);

	var media = moviesRated[moviesRated.length-1];

	moviesRated.sort(function(a, b){

		if (a.titulo != undefined){
			return a.titulo.localeCompare(b.titulo);	
		}
		
	});

	var content = "<table>";

	for (var i=0; i<(moviesRated.length); i++){

		if (moviesRated[i].id == undefined){
			continue;
		}

		var color = "antiquewhite";

		if (i%2 == 0){

			var color = "bisque";
		}

		content += "<tr>";
		content += "<td style=\"background-color: "+color+"\">";
		content += moviesRated[i].titulo;
		content += " - ";
		content += moviesRated[i].genres;
		content += "</td>";
		content += "<td style=\"background-color: "+color+"\">";
		content += moviesRated[i].rating;
		content += "</td>";
		content += "</tr>";
	}

	content += "<tr><td colspan=\"2\">Filmes avaliados: "+(moviesRated.length-1)+" Média: "+media+"</td></tr>";
	content += "</table>";

	document.getElementById(ratings).innerHTML = content;

	//console.log(moviesRated);
}