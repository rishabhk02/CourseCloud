const contactUsEmailTemplate = require('../mail/templates/contactFormResponse');
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo } = req.body;
  try {
    console.log(req.body);
    // await mailSender(email, "Contact form details recevied", contactUsEmailTemplate(email, firstname, lastname, message, phoneNo));
    return res.status(201).json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Something went wrong while sending contact form confirmation." });
  }
};
