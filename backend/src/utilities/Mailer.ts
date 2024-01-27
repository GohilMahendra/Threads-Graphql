import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, otp: string) => {
    const mailer_email = process.env.MAILER_EMAIL
    const mailer_password = process.env.MAILER_PASS
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mailer_email,
            pass: mailer_password
        }
    })

    const mailOptions = {
        from: "Threads app",
        to: email,
        subject: "email verificaiton",
        text: `here is the otp for verification ${otp} `
    }
    try {
        await transporter.sendMail(mailOptions)
    }
    catch (err: any) {
        throw new Error(err)
    }
}