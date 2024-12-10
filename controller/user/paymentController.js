/**
 createPaymentIntent crea una intención de pago y devuelve un client_secret para procesar el pago en el frontend.
createCheckoutSession crea una sesión de pago para redirigir a Stripe Checkout y procesa el pago usando la sesión.
 */
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(req, res) {
    try {
        const { amount } = req.body; // Cantidad a cobrar en céntimos
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'ars',//'usd',
            payment_method_types: ['card'],
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function createCheckoutSession(req, res) {
    try {
        const { items } = req.body;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productName,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPaymentIntent,
    createCheckoutSession,
};

