const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")
const Subscriber = require("../../models/Subscriber");
const nodemailer = require("nodemailer");

async function UploadProductController(req, res) {
    try {
        const sessionUserId = req.userId

        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permiso denegado")
        }
        // Crear el producto
        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()

        const subscribers = await Subscriber.find({});

        // Configuración de nodemailer 
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD, 
            },
        });
        
        // Iterar sobre los suscriptores y enviarles un correo electrónico
        for (const subscriber of subscribers) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: subscriber.email, 
                subject: 'COYANA: Nuevo producto disponible', 
               // text: `Hola! Hemos agregado un nuevo producto: ${saveProduct.productName }. Descripción: ${saveProduct.description}. Precio: $${saveProduct.price}. Prenda nueva! : ${saveProduct.productImage}.
               // ¡Visítanos para más detalles en Coyana!`,
               html: `
               <h1>¡Hola!</h1>
               <p>Hemos agregado un nuevo producto: <strong>${saveProduct.productName}</strong></p>
               <p>Descripción: ${saveProduct.description}</p>
               <p>Precio: $${saveProduct.price}</p>
               <p>¡Prenda nueva!</p>
               <img src="${saveProduct.productImage}" alt="${saveProduct.productName}" style="width:300px; height:auto;" />
               <p>¡Visítanos para más detalles en Coyana!</p>
           `,
            };

            await transporter.sendMail(mailOptions);
        }
        // Respuesta al cliente 
        res.status(201).json({
            message: "Carga del producto exitosamente", 
            error: false,
            success: true,
            data: saveProduct
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = UploadProductController