const Contact = require('../../models/Contact');
const nodemailer = require('nodemailer');

exports.contactForm = async (req, res) => {
  const { name, email, message } = req.body;

  // Validar si todos los campos están presentes
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Crear un nuevo mensaje de contacto
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Configurar Nodemailer para enviar el correo de contacto
    let transporter = nodemailer.createTransport({
      service: 'gmail', // o cualquier otro servicio de correo que utilices
      auth: {
        user: process.env.EMAIL, // Utiliza variables de entorno para mayor seguridad
        pass: process.env.EMAIL_PASSWORD, // Contraseña o token de aplicación
      },
    });

    // Configurar el contenido del correo
    let mailOptions = {
      from: process.env.EMAIL, // El correo desde el cual se envía
      to: email, // Correo del usuario que envió el mensaje
      subject: 'Gracias por ponerte en contacto',
      text: `Hola ${name},\n\nGracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\nMensaje recibido:\n\n"${message}"\n\nSaludos,\nEl equipo de soporte.`,
    };

    // Enviar el correo de confirmación
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error al enviar el correo.', error });
      }
      return res.status(200).json({ message: 'Mensaje enviado correctamente y correo de confirmación enviado.' });
    });

  } catch (error) {
    return res.status(500).json({ message: 'Hubo un problema al enviar tu mensaje.', error });
  }
};
