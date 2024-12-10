const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req,res){
    try{
        const { email , password} = req.body

        if(!email){
            throw new Error("Por favor proporcione correo electrónico") //Please provide email
        }
        if(!password){
             throw new Error("Por favor proporcione la contraseña") //Please provide password
        }

        const user = await userModel.findOne({email})

       if(!user){
            throw new Error("El usuario no se encontro") //User not found
       }

       const checkPassword = await bcrypt.compare(password,user.password)

       console.log("checkPassoword",checkPassword)

       if(checkPassword){
        const tokenData = {
            _id : user._id,
            email : user.email,
        }
        //28800 segundos en 8 horas inspira el token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        const tokenOption = {
            httpOnly : true,
            secure : true
        }

        res.cookie("token",token,tokenOption).status(200).json({
            message : "Iniciar sesión exitosamente", //Login successfully
            data : token,
            success : true,
            error : false
        })

       }else{
         throw new Error("Por favor verifique la contraseña") //
       }







    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }

}

module.exports = userSignInController