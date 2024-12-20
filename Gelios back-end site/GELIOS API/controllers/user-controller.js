const userService = require('../service/user-service');
const {validationResult} =require('express-validator');
const ApiError= require('../exceptions/api-error')

class UserController{
    async registration(req,res,next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации'), errors.array())
            }
            const {email, password,country,name,surname,passportNum,passportSer} = req.body;
            const userData = await userService.registration(email,password,country,name,surname,passportNum,passportSer);
            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30*24*60*1000,httpOnly: true})
            return res.json(userData);
        }
        catch(e){
            next(e)
        }
    }
    async login(req,res,next){
        try{
            const {email,password}=req.body;
            const userData = await userService.login(email,password);
            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30*24*60*1000,httpOnly: true})
            return res.json(userData);
        }
        catch(e){
            next(e)
        }
    }
    async logout(req,res,next){
        try{
            console.log(req.body)
            const {refreshToken} = req.body;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(token);
        }
        catch(e){
            next(e)
        }
    }
    async activate(req,res,next){
        try{
            const activationLink =req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch(e){
            next(e)
        }
    }
    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken',userData.refreshToken, {maxAge: 30*24*60*1000,httpOnly: true})
            return res.json(userData);
        }
        catch(e){
            next(e)
        }
    }
    async getUserInfo(req,res,next){
        try{
            const {accesstoken} = req.headers;
            const userData = await userService.getData(accesstoken);
            return res.json(userData)
        }
        catch(e){
            next(e)
        }
    }

    async addToCart(req,res,next){
        try{
            const {accesstoken,productId} = req.body;
            const userCart = await userService.addCart(accesstoken,productId);
            return res.json(userCart)
        }
        catch(e){
            next(e)
        }
    }

    async removeFromCart(req,res,next){
        try{
            console.log(req.body)
            const {accesstoken,productId}=req.body;
            const userCart = await userService.removeCart(accesstoken,productId);
            return res.json(userCart)
        }
        catch(e){
            next(e)
        }
    }

    async getCart(req,res,next){
        try{
            const {accesstoken} = req.headers;
            console.log(accesstoken);
            const userCart = await userService.getCart(accesstoken);
            return res.json(userCart)
        }
        catch(e){
            next(e)
        }
    }
}



module.exports = new UserController();