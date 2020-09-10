if (process.env.NODE_ENV !== "production") {
	require("dotenv").config()
}
var sslRedirect = require('heroku-ssl-redirect');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'etudereaderllc@gmail.com',
		pass: 'ibeabazbbdlwnurk'
	}
});
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://adminDude:MagneticMedicalWires@etude-zno3q.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true
});
const express = require("express")
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const app = express();
console.log("The keys are ", stripeSecretKey, stripePublicKey)
console.log(process.env);
console.log(process.env.PORT);
app.set("view engine", "ejs")
var cors = require('cors')

app.use(sslRedirect())
app.use(express.static("./"))
app.use(express.json())
app.use(cors())
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(stripeSecretKey);

app.post('/create-customer', async (req, res) => {
	// This creates a new Customer and attaches
	// the PaymentMethod to be default for invoice in one API call.
	console.log("attempting to create customer");
	const customer = await stripe.customers.create({
		payment_method: req.body.payment_method,
		email: req.body.email,
		invoice_settings: {
			default_payment_method: req.body.payment_method
		}
	});
	// At this point, associate the ID of the Customer object with your
	// own internal representation of a customer, if you have one.
	const subscription = await stripe.subscriptions.create({
		customer: customer.id,
		items: [{
			plan: process.env.SUBSCRIPTION_PLAN_ID
		}],
		expand: ['latest_invoice.payment_intent'],
		collection_method: 'charge_automatically',
	});
	var objToAdd = {
		stripeID: subscription.id,
		used: false
	}
	client.connect(err => {
		const collection = client.db("UserData").collection("Licenses");
		collection.insertOne(objToAdd)
	});
	console.log(req.body.email)
	const mailOptions = {
		from: 'etudereaderllc@gmail.com', // sender address
		to: req.body.email, // list of receivers
		subject: 'Étude Subscription', // Subject line
		html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
<style id="media-query" type="text/css">
		@media (max-width: 520px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col>div {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num8 {
				width: 66% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="transparent" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #eeeeee;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#eeeeee;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:#eeeeee"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:#eeeeee;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Image" border="0" class="center autowidth" src="https://alimirzazadeh.github.io/EtudeBannerEmail.PNG" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 500px; display: block;" title="Image" width="500"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#000c7b;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 14px; line-height: 1.2; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #000c7b; mso-line-height-alt: 17px;">
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 24px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong>Welcome to Étude!</strong></span></p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 14px; line-height: 1.2; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 17px;">
<p style="line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; font-size: 16px; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;"><strong>Your License Code: ` + subscription.id + ` </strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 14px; line-height: 1.2; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 17px;">
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">We are so excited to have you on board. Above is the License Key associated with your purchase which you can use to activate Étude the first time you open it (and also to cancel your subscription at any point in time). On behalf of the entire Étude team, we want to thank you for joining us on this journey. </p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Remember, we are always here to help! If you have any questions, comments, or concerns, feel free to email us at etudereaderllc@gmail.com or give us a call at (336)-529-0307.</p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Regards,</p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">The Étude team.</p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 16px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 19px; margin: 0;"><span style="font-size: 16px;"><strong>Reader Smarter. Read Better.</strong></span></p>
<p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"> </p>
<p style="font-size: 8px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 10px; margin: 0;"><span style="font-size: 8px;">Copyright 2020 Etude Reader LLC. </span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html> ` // plain text body

	};

	// Sends mail
	transporter.sendMail(mailOptions, function (err, info) {
		if (err)
			console.log(err)
		else
			console.log(info);
	});

	res.send(subscription);
});
app.get("/checkout", (req, res) => {
	// Display checkout page
	const path = resolve(process.env.STATIC_DIR + "/index.html");
	res.sendFile(path);
});

const calculateOrderAmount = items => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return 199;
};

app.post("/create-payment-intent", async (req, res) => {
	const {
		items,
		currency
	} = req.body;
	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(items),
		currency: currency
	});
	console.log(paymentIntent)
	// Send publishable key and PaymentIntent details to client
	res.send({
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
		clientSecret: paymentIntent.client_secret
	});
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
app.post("/webhook", async (req, res) => {
	let data, eventType;

	// Check if webhook signing is configured.
	if (process.env.STRIPE_WEBHOOK_SECRET) {
		// Retrieve the event by verifying the signature using the raw body and secret.
		let event;
		let signature = req.headers["stripe-signature"];
		try {
			event = stripe.webhooks.constructEvent(
				req.rawBody,
				signature,
				process.env.STRIPE_WEBHOOK_SECRET
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed.`);
			return res.sendStatus(400);
		}
		data = event.data;
		eventType = event.type;
	} else {
		// Webhook signing is recommended, but if the secret is not configured in `config.js`,
		// we can retrieve the event data directly from the request body.
		data = req.body.data;
		eventType = req.body.type;
	}

	if (eventType === "payment_intent.succeeded") {
		// Funds have been captured
		// Fulfill any orders, e-mail receipts, etc
		// To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
		console.log("💰 Payment captured!");
	} else if (eventType === "payment_intent.payment_failed") {
		console.log("❌ Payment failed.");
	}
	res.sendStatus(200);
});

app.post('/delete-key', (req, res) => {
	stripe.subscriptions.del(
		req.body.subscriptionID,
		function (err, confirmation) {
			if (err) {
				res.json({
					success: false
				})
			} else {
				res.json({
					success: true
				})
			}
		}
	);
})
app.post('/add-email', (req, res) => {
	var objNeededToAdd = {
		"email": req.body.email,
		"referral": req.body.referral
	}
	client.connect(err => {
		console.log(err)
		const collection = client.db("UserData").collection("Emails");
		collection.insertOne(objNeededToAdd)
		res.json({
			message: "Successfully added to email"
		})
	});

})
app.get('/public-key', (req, res) => {
	res.send({
		publicKey: process.env.STRIPE_PUBLISHABLE_KEY
	});
});
app.post('/add-customer-info', (req, res) => {
	var objNeededToAdd = {
		"name": req.body.name,
		"email": req.body.email,
		"phone": req.body.phone,
		"referral": req.body.referral,
	}
	client.connect(err => {
		console.log(err)
		const collection = client.db("UserData").collection("CustomerInformation");
		collection.insertOne(objNeededToAdd)
		res.json({
			message: "Successfully added to customer information"
		})
	});

})
app.post('/pay', function (req, res) {
	console.log(req.body)
	stripe.charges.create({
		amount: 200,
		source: req.body.stripeTokenId,
		currency: "usd"
	}).then(function () {
		console.log('paid')
		res.json({
			message: "Successfully purchased Item"
		})
	})
});



app.listen(process.env.PORT || 3000)
