(function($) {
    'use strict';
    var stripe = Stripe('pk_live_uaKtcGeffpeHfRiun89jKLBY00GoOGldq2');

    var submitform = document.getElementById("submitform");
    submitform.addEventListener('click', function(event) {
        var cancelform = document.getElementById("cancelform");
        console.log(cancelform["licensekey"].value);
		const response = fetch('/delete-key', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				subscriptionID: cancelform["licensekey"].value
			})
		}).then(response => {
			return (response.json())
		})
		response.then(function(answer) {
			if(answer.success) {
				console.log("SUCCESS")
				var example = document.getElementById("example1id");
				console.log(example);
				example.classList.add('submitting');
				example.classList.remove('submitting');
				example.classList.add('submitted');
				// Your application has indicated there's an error
				window.setTimeout(function(){

				// Move to a new location or you can do something else
				window.location.href = "https://www.etudereader.com/downloads.html";
		
				}, 6000);

			} else {
				console.log("FAILURE");
				var errormessage = document.getElementById("errormessage");
				errormessage.innerHTML = "Invalid License Key";
				//DO SOMETHING FOR FAILURE
			}
		})
    })
})();

