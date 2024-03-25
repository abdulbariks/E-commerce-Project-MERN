const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secret");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  // console.log(smtpUsername);
  // console.log(smtpPassword)

  const emailWithNodeMailer = async(emailData)=>{
   try {
    const mailoptions = {
        from: smtpUsername, // sender address
        to: emailData.email, // list of receivers
        subject: emailData.subject, // Subject line
        html: emailData.html, // html body
         }
    
         const info = await transporter.sendMail(mailoptions);
         console.log('Message sent :%s', info.response)
    
   } catch (error) {
    console.error('Error occured while sending email',error)
    throw error;
   }
  }

  module.exports = {emailWithNodeMailer};