//Send an email before saving data in DB
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey( process.env.SENDGRID_API_KEY )

// exports.signup = ( req, res ) => {
//     // console.log("signing up:", req.body)
//     // Make sure user doesn't exist
//     const { name, email, password } = req.body

//     User.findOne({email: email}).exec( (err, user) => {
//         if( user ){
//             return res.status(400).json({error: "Email is taken."})
//         }
//     } )

//     let newUser = new User({ name, email, password })
//     console.log("name is:", name)
//     console.log("email is:", email)
//     console.log("password is:", password)
//     newUser.save( (err, success) => {
//         if( err ){
//             console.log("SIGNUP ERROR: ", err)
//             return res.status(400).json({ error: err })
//         }
//         res.json({
//             created: true,
//             user: newUser
//         })
//     } )
// }

exports.signup = ( req, res ) => {
    const {name, email, password} = req.body
    User.findOne({email: email}).exec( (err, user) => {
        if( user ){
            return res.status(400).json({error: "Email is taken."})
        }
        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '20m'})
        //Now we sent to the users email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account activation link',
            html: `
                <p>Please use the following link to activate your account</p>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                `
        }
        sgMail.send( emailData )
            .then( sent => {
                console.log("SIGNUP EMAIL SENT", sent)
                return res.json({
                    message: `Email has been sent to ${email}. Oh right?`
                })
            } )
            .catch( e => console.log("Sent error:", e.response.body.errors) )
    } );
}

exports.accountActivation = ( req, res ) => {
    console.log("O get here:", req)
    const { token } = req.body
    if( token ){
        jwt.verify( token, process.env.JWT_ACCOUNT_ACTIVATION, function( err, decoded ) {
            if( err ){
                console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR:", err)
                return res.status(401).json({
                    error: 'Expired link. signup again'
                })
            }
            //Not error
            const { name, email, password } = jwt.decode( token )
            const user = new User( { name, email, password } )
            user.save( (err, user)=> {
                if( err ){
                    console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err)
                    return res.status(401).json({
                        error: 'Error saving user in database'
                    })
                }
                return res.status(400).json({
                    message: 'Signup success. Please sign in'
                })
            } )
        })
    }else{
        return res.status(401).json({
            error: 'No token. try again'
        })
    }   
} 


exports.signin = ( req, res ) => {
    const { email, password } = req.body
    //First check if the user alredy signup
    User.findOne( {email} ).exec( (err, user) => {
        if( err || !user ){
            return res.status(400).json({
                error: 'Email does not exist. Please sign up'
            })
        }
        //Authenticate then
        if( !user.authenticate( password ) ){
            return res.status(400).json({
                error: 'Email and password does not match'
            })
        }else{
            //Generate toke and send to client
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            const { _id, name, email, role } = user
            // return res.status(200).json({
            //     message: "Sign-in success"
            // })
            return res.json({
                token,
                user: { _id, name, email, role }
            })
        }
    } )
}