const Subscriber = require('../../models/Subscriber');
const nodemailer = require('nodemailer');

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Este correo ya está suscrito.' });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Configurar Nodemailer para enviar el correo de suscripción
    let transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    // Configurar el contenido del correo
    let mailOptions = {
      from: process.env.EMAIL, 
      to: email, 
      subject: 'Gracias por suscribirte',
      text: '¡Gracias por suscribirte a nuestro boletín! Te mantendremos informado sobre nuevos productos y ofertas.',
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error al enviar el correo.', error });
      }
      return res.status(200).json({ message: 'Suscripción exitosa y correo enviado.' });
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al suscribirse.', error });
  }
};

 