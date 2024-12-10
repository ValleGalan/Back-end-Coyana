const mongoose = require('mongoose');

// Esquema para el modelo de contacto
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo electrónico válido'], // Validación de correo electrónico
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Crear el modelo Contact con el esquema definido
const Contact = mongoose.model('Contact', ContactSchema);

// Exportar el modelo
module.exports = Contact;
