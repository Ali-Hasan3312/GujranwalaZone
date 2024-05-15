import NodeMailer from "nodemailer"
import { emailOptionsProps } from "../types/types.js";


const sendEmail =  async (options:emailOptionsProps) =>{
    const transporter = NodeMailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        }
    });
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message

    };
    
    await transporter.sendMail(mailOptions);
    
}

export {sendEmail}
