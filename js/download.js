(function($) {
	'use strict';
	console.log("Download Checkpoint 0");

	function emailIsValid (email) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	var starttrial = document.getElementById("trialbutton");
	starttrial.addEventListener('click', function(event) {
		// Get inputted email
		let inputEmail = document.getElementById("trialemailinput").value;
		let inputReferral = document.getElementById("referralinput").value;
		// Check email validity before making changes
		if (emailIsValid(inputEmail)) {
			// Remove the potential error message
			document.getElementById("trialemailerror").style.opacity = 0;
			// Display downlad links
			document.getElementById("downloadlinkscontainer").style.display = "block";
			// 		Timeout is necessary otherwise the transition doesn't take effect
			setTimeout(
				function() 
				{
					document.getElementById("downloadlinkscontainer").style.opacity = 1;
				}, 0.1);

			// Send the result to the server
			fetch('https://etude-reader.herokuapp.com/add-email', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: inputEmail,
					referral: inputReferral
				})
			}).then(response => {
				console.log(response)
			})
			
		} else {
			document.getElementById("trialemailerror").style.opacity = 1;
		}
	});
})();