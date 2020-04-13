
//Send an email before saving data in DB
// const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey( process.env.SENDGRID_API_KEY )

exports.bot = ( req, res ) => {
    
    console.log( req.body )
    return res.status(200).json({
        message: "Thanks for subbing. For fave months.",
        info: req.body
    })

}