module.exports=class UserDto {
    email;
    id;
    isActivated;
    country;

    constructor(model){
        this.email=model.email;
        this.id=model._id;
        this.isActivated=model.isActivated;
        this.country=model.country;
        this.name=model.name;
        this.surname=model.surname;
        this.passportNum=model.passportNum;
        this.passportSer=model.passportSer;
    }
}