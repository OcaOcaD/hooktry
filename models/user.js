const mongoose = require('mongoose')
const crypto = require('crypto')
// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        trim: true,
        max: 32,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: String,
        default: "subscriber"
    },
    resetPasswordLink:{
        data: String,
        default: ''
    }
}, {timestamps: true})
// Virtual  
//  - Take plainpassword and save the hashedPassword
userSchema.virtual('password')
    .set( function( password ){
        console.log("INT HE SCHEMA", password)
        let hp = this.encryptPassword(password)
        console.log( hp )
        this._password = password
        this.salt = this.makeSalt()
        this.hashedPassword = this.encryptPassword(password)
    } )
    .get( function(){
        return this._password
    } )
// Methods
userSchema.methods = {
    authenticate: function( plainText ){
        return this.encryptPassword( plainText ) === this.hashedPassword
    },

    encryptPassword: function( password ){
        if( !password ) return ''
        try{
            return crypto
                .createHmac('sha1', password)
                .update('password')
                .digest('hex');
        }catch( err ){
            return 'error encrypting'+err
        }
    },

    makeSalt: function(){
        return Math.round( new Date().valueOf()* Math.random()) + ''
    }
}

module.exports = mongoose.model( 'User', userSchema )