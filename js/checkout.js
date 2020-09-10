(function() {
	'use strict';

	var orderData = {
		items: [{
			id: "prod_GMPNfKK1mb4Hvb"
		}],
		currency: "usd"
	};

	var stripe = Stripe('pk_live_uaKtcGeffpeHfRiun89jKLBY00GoOGldq2');
	var elements = stripe.elements({
		// Stripe's examples are localized to specific languages, but if
		// you wish to have Elements automatically detect your user's locale,
		// use `locale: 'auto'` instead.
		locale: window.__exampleLocale
	});
	var card = elements.create('card', {
		iconStyle: 'solid',
		style: {
			base: {
				iconColor: '#c4f0ff',
				color: '#fff',
				fontWeight: 500,
				fontFamily: 'Poppins, sans-serif',
				fontSize: '16px',
				fontSmoothing: 'antialiased',

				':-webkit-autofill': {
					color: '#fce883',
				},
				'::placeholder': {
					color: '#87BBFD',
				},
			},
			invalid: {
				iconColor: '#FFC7EE',
				color: '#FFC7EE',
			},
		},
	});
	card.mount('#example1-card');

	function registerElements(elements, exampleName) {
		var formClass = '.' + exampleName;
		var example = document.querySelector(formClass);

		var form = example.querySelector('form');
		var resetButton = example.querySelector('a.reset');
		var error = form.querySelector('.error');
		var errorMessage = error.querySelector('.message');

		function enableInputs() {
			Array.prototype.forEach.call(
				form.querySelectorAll(
					"input[type='text'], input[type='email'], input[type='tel']"
				),
				function(input) {
					input.removeAttribute('disabled');
				}
			);
		}

		function disableInputs() {
			Array.prototype.forEach.call(
				form.querySelectorAll(
					"input[type='text'], input[type='email'], input[type='tel']"
				),
				function(input) {
					input.setAttribute('disabled', 'true');
				}
			);
		}

		function triggerBrowserValidation() {
			// The only way to trigger HTML5 form validation UI is to fake a user submit
			// event.
			var submit = document.createElement('input');
			submit.type = 'submit';
			submit.style.display = 'none';
			form.appendChild(submit);
			submit.click();
			submit.remove();
		}

		// Listen for errors from each Element, and show error messages in the UI.
		var savedErrors = {};
		elements.forEach(function(element, idx) {
			element.on('change', function(event) {
				if (event.error) {
					error.classList.add('visible');
					savedErrors[idx] = event.error.message;
					errorMessage.innerText = event.error.message;
				} else {
					savedErrors[idx] = null;

					// Loop over the saved errors and find the first one, if any.
					var nextError = Object.keys(savedErrors)
						.sort()
						.reduce(function(maybeFoundError, key) {
							return maybeFoundError || savedErrors[key];
						}, null);

					if (nextError) {
						// Now that they've fixed the current error, show another one.
						errorMessage.innerText = nextError;
					} else {
						// The user fixed the last error; no more errors.
						error.classList.remove('visible');
					}
				}
			});
		});

		// Listen on the form's 'submit' handler...
		form.addEventListener('submit', function(e) {
			e.preventDefault();


			// // Trigger HTML5 validation UI on the form if any of the inputs fail
			// // validation.
			// var plainInputsValid = true;
			// Array.prototype.forEach.call(form.querySelectorAll('input'), function(
			// 	input
			// ) {
			// 	if (input.checkValidity && !input.checkValidity()) {
			// 		plainInputsValid = false;
			// 		return;
			// 	}
			// });
			// if (!plainInputsValid) {
			// 	triggerBrowserValidation();
			// 	return;
			// }

			// Show a loading screen...
			example.classList.add('submitting');

			// Disable all inputs.
			disableInputs();

			fetch('https://etude-reader.herokuapp.com/add-customer-info', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: form.querySelector('#' + exampleName + '-name').value,
					email: form.querySelector('#' + exampleName + '-email').value,
					phone: form.querySelector('#' + exampleName + '-phone').value,
					referral: form.querySelector('#' + exampleName + '-referral').value
				})
			}).then(response => {
				console.log(response)
			})


			// Gather additional customer data we may have collected in our form.
			var name = form.querySelector('#' + exampleName + '-name');
			var address1 = form.querySelector('#' + exampleName + '-address');
			var city = form.querySelector('#' + exampleName + '-city');
			var state = form.querySelector('#' + exampleName + '-state');
			var zip = form.querySelector('#' + exampleName + '-zip');
			var additionalData = {
				name: name ? name.value : undefined,
				address_line1: address1 ? address1.value : undefined,
				address_city: city ? city.value : undefined,
				address_state: state ? state.value : undefined,
				address_zip: zip ? zip.value : undefined,
			};
			console.log("GOING HERE")
			console.log(elements[0])
			// Use Stripe.js to create a token. We only need to pass in one Element
			// from the Element group in order to create a token. We can also pass
			// in the additional customer data we collected in our form.
			stripe.createToken(elements[0], additionalData).then(function(result) {
				// Stop loading!
				console.log(result)
				example.classList.remove('submitting');

				if (result.token) {
					// If we received a token, show the token ID.
					// example.querySelector('.token').innerText = result.token.id;
					example.classList.add('submitted');
					console.log(form.querySelector('#' + exampleName + '-email').value)
					stripe.createPaymentMethod('card', card, {
						billing_details: {
							email: form.querySelector('#' + exampleName + '-email').value,
						},
					}).then(function(result) {
						console.log(result.paymentMethod.id)
						fetch('https://etude-reader.herokuapp.com/create-customer', {
								method: 'post',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									email: form.querySelector('#' + exampleName + '-email').value,
									payment_method: result.paymentMethod.id
								})
							}).then(response => {
								return response.json();
							})
							.then(customer => {
								console.log(customer)
							});
					});

					// console.log("HERER")
					// fetch("/create-payment-intent", {
					// 		method: "POST",
					// 		headers: {
					// 			"Content-Type": "application/json"
					// 		},
					// 		body: JSON.stringify(orderData)
					// 	})
					// 	.then(function(result) {
					// 		return result.json();
					// 	})
					// 	.then(function(data) {
					// 		return setupElements(data);
					// 	})
					// 	.then(function({
					// 		stripe,
					// 		card,
					// 		clientSecret
					// 	}) {

					// 		// Initiate payment when the submit button is clicked
					// 		pay(stripe, card, clientSecret)
					// 	});
				} else {
					// Otherwise, un-disable inputs.
					enableInputs();
				}
			});
		});
	}

	function setupElements(data) {
		return {
			stripe: stripe,
			card: card,
			clientSecret: data.clientSecret
		}
	}

	var pay = function(stripe, card, clientSecret) {
		console.log("HERERER")
		// Initiate the payment.
		// If authentication is required, confirmCardPayment will automatically display a modal
		stripe
			.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card
				}
			})
			.then(function(result) {
				if (result.error) {
					// Show error to your customer
					console.log(result.error)
					showError(result.error.message);
				} else {
					// The payment has been processed!
					orderComplete(clientSecret);
				}
			});
	};

	var orderComplete = function(clientSecret) {
		stripe.retrievePaymentIntent(clientSecret).then(function(result) {
			var paymentIntent = result.paymentIntent;
			var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
			console.log(paymentIntentJson)
		});
	};

	registerElements([card], 'example1');



})();
