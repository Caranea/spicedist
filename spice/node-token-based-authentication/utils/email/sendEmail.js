const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
       port: 465,
       secure: true,
       auth: {
         type: 'OAuth2',
         user: 'w2we2re@gmail.com',
        accessToken: 'ya29.A0ARrdaM8KqjQ6FEmSzFUbpJ0gigTl9zeiEoQ7IPoDCbNAQ0geSJaQaipdGfEiaho6v7GcgxVfmA12_BI40QjCQWrq_RcV15Ek3M2GkGPGxIDKXPT10yZdoU4vkbi23SEjTUPrERxfrQfxrghsUKI-CWKkm8TF',
        refreshToken: '1//04f1nNPoETxHjCgYIARAAGAQSNwF-L9IrZRYYxxiKS-fYF5YfIx5E-9wOesUR1D_0r0dN4yeQZlKtj_ceJBpsJnj412FNBvGrCBk'
       }
    });
    console.log(transporter)
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: 'w2we2re@gmail.com',
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        console.log(error)
        return error;
      } else {
        console.log(res)
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;
