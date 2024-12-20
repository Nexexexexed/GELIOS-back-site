const UserModel=require('../models/user-model');
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require("../dtos/user-dto")
const ApiError = require("../exceptions/api-error");
const { buildCheckFunction } = require('express-validator');

class UserService{
    async registration(email,password,country,name,surname,passportNum,passportSer){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с ${email} email-ом уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email,password: hashPassword,activationLink,country,name,surname,passportNum,passportSer})
        await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        console.log(tokens);
        await tokenService.saveToken(userDto.id,tokens.refreshToken,tokens.accessToken);

        return{...tokens,user: userDto}
    }



    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Некоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email,password){
        const user= await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest("Пользователь с таким e-amil не был найден")
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest("Некоректный пароль")
        }
        const userDto= new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken,tokens.accessToken);

        return{...tokens,user: userDto}
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnathorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb= await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken,tokens.accessToken);

        return{...tokens,user: userDto}

    }


    async getData(accessToken){
        const userData = tokenService.validateAccessToken(accessToken);
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        console.log(userDto);
        return {user: userDto}
    }


    async addCart(accessToken,productId){

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            throw ApiError.UnathorizedError();
        }

        const user = await UserModel.findById(userData.id);
        if(!user){
            throw ApiError.BadRequest('User not found');
        }

        if (productId in user.cart) {
            user.cart[productId] += 1;
        }
        else{
            throw ApiError.BadRequest('Invalid productId');
        }
        await user.save();
        return user.cart;
    }


    async removeCart(accessToken,productId){
        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id);
        if(!user){
            throw ApiError.BadRequest('User not found');
        }
        if (productId in user.cart) {
            user.cart[productId] = 0;
        }
        else{
            throw ApiError.BadRequest('Invalid productId');
        }
        await user.save();
        return user.cart;
    }


    async getCart(accessToken){
        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData){
            throw ApiError.UnathorizedError();
        }
        const user = await UserModel.findById(userData.id);
        if(!user){
            throw ApiError.BadRequest('User not found');
        }
        return  user.cart;
    }
}


module.exports = new UserService();