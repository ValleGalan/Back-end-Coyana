//configuracion del metodo de pago

const Stripe = require('stripe')

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = stripe