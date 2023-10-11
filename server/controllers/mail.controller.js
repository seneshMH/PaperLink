import nodemailer from 'nodemailer';

export const sendMail = async (req, res) => {
    try {
        const { name, email, text } = req.body;

        if (!name || !email || !text) {
            throw new Error("Please fill all the fields");
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ea40c5c3212dd7",
                pass: "224ac4269cfb27"
            }
        });

        const mailOptions = {
            from: email,
            to: 'hansanasm5@gmail.com',
            subject: `Message from ${name}`,
            text: text
        };

        await transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                throw new Error(error.message);
            } else {
                res.send({
                    success: true,
                    message: "Email sent successfully",
                });
            }
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
};
