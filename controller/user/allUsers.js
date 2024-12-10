const userModel = require("../../models/userModel")

async function allUsers(req,res){
    try{
        console.log("ID de usuario todas las usuarias",req.userId) //userid all Users

        const allUsers = await userModel.find()
        
        res.json({
            message : "Todos los usuarios", //All User
            data : allUsers,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = allUsers