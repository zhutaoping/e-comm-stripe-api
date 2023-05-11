require("dotenv").config();
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const corsOptions = require("./config/corsOptions");

const app = express();
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
	console.log("req.body", req.body);

	const items = req.body.items;
	let lineItems = [];
	items.forEach((item) => {
		lineItems.push({
			price: item.stripeId,
			quantity: item.count,
		});
	});

	const BASE_URL =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: "https://e-commerce-site-hazel.vercel.app";

	const session = await stripe.checkout.sessions.create({
		// payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: `https://e-commerce-site-hazel.vercel.app/success`,
		cancel_url: `${BASE_URL}/cancel`,
	});

	res.send(JSON.stringify({ url: session.url }));
});

app.listen(4000, () => console.log("Server is running on port 4000"));
