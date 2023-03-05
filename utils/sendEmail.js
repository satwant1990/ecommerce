import nodemailer from 'nodemailer'

export const sendEmail = async (options)=>{
    console.log(process.env.SMPT_MAIL,process.env.SMPT_PASSWORD)
    const transporter = nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.email,
        text:options.message,
    }
    await transporter.sendMail(mailOptions)
}