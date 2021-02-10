"use strict";
const nodemailer = require("nodemailer");
const { SERVER_SECRET } = process.env

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({

    // for initial testing
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    // auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    // },

    host: process.env.EMAIL_HOST, // smtp.zoho.com
    port: 465,
    secure: true, // true for 465, false for other ports (587)
    auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASSWORD}`, 
    },

});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail({ 
    to='',
    from=`"Fred Foo 👻" <foo@example.com>`,
    subject='',
    html='',
    text='' 
}) {

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from, // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

}

async function sendConfirmationEmail({ to='', userId=-1 }) {

    const jwt = require('jsonwebtoken')

    const token = jwt.sign(
        { user_id: userId },
        SERVER_SECRET,
        { expiresIn: '1d' }
    )

    const code = encodeURIComponent(token)

    const url = `http://localhost:3000/verify_email?token=${code}`

    const html = `
        <div>Please click this link to confirm your email: <a href="${url}">${url}</a><div>
        <div>This link will expire in 24 hours.<div>
    `

    const text = `
        Please confirm your email here: ${url}

        This link will expire in 24 hours.
    `

    await sendEmail({ 
        from: `"Hire Apply" <abocabo@abocabo.com>`,
        to,
        subject: 'Please confirm your email',
        html,
        text,
    })

}

module.exports = { 
    sendEmail,
    sendConfirmationEmail
}