import { stripe } from "../middlewares/stripe.middleware.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;
    if(!Array.isArray(products) || products.length === 0){
      return res.status(401).json({
        error:true,
        message:'Empty cart.'
      })
    }
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.pice * 100)
      totalAmount += amount;

      return{
        price_data:{
          currency:'usd',
          product_data:{
            name:product.name,
            image:[product.image]
          },
          unit_amount:amount
        },
        quantity: product.quantity || 1
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:lineItems,
      mode:'payment',
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      metadata:{
        userId:req.user._id.toString(),
        products: JSON.stringify(products.map((p) => ({
          id:p._id,
          quantity:p.quantity,
          price:p.price
        })))
      }
    })

    return res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

  } catch (error) {
    console.log('Error in create checkout session controller.' , error.message)
  }
};


export const checkoutSuccess = async (req, res) => {
  try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100,
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};
