// sk_test_51N6CbDE8RMt6RxLnNusCD8xkI1uLL9NatqhvAOWdeb4JKT8DtxtpCEuOWFODGq2bKsloDTZKjZo6UQqDvJSSM5eh001Fs2qe8w

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
	"sk_test_51N6CbDE8RMt6RxLnNusCD8xkI1uLL9NatqhvAOWdeb4JKT8DtxtpCEuOWFODGq2bKsloDTZKjZo6UQqDvJSSM5eh001Fs2qe8w"
);
const corsOptions = require("./config/corsOptions");

const app = express();
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
	/**
	 * req.body.items =
	 * [
	 *  {
	 *    id: 1,
	 *    quantity: 3
	 *  },
	 * ]
	 * stripe Wants =
	 * [
	 *  {
	 *    price: 1,
	 *    quantity: 3
	 *  }
	 * ]
	 */
	console.log("req.body", req.body);

	const items = req.body.items;
	let lineItems = [];
	items.forEach((item) => {
		lineItems.push({
			price: item.stripeId,
			quantity: item.count,
		});
	});

	const session = await stripe.checkout.sessions.create({
		// payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: "https://e-commerce-site-hazel.vercel.app/success",
		cancel_url: "https://e-commerce-site-hazel.vercel.app/cancel",
	});

	res.send(JSON.stringify({ url: session.url }));
});

app.listen(4000, () => console.log("Server is running on port 4000"));
