function computeMAEUserUser(){
	
	var sumDiff = 0, nrItems = 0;

	for (var i=1; i<10; i++){

		console.log("Computing predictions for user "+i);
		var predictions = recomendarUserUser(i);

		for (var p in predictions){

			if (predictions[p].userRating > 0){

				sumDiff += Math.abs(predictions[p].rating - predictions[p].userRating);
				nrItems++;
			}
		}
	}

	MAE = sumDiff / nrItems;

	console.log("MAE = "+MAE);
}