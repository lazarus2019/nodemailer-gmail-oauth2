const sendMailRoute = require("express").Router();
const oAuth2Client = require("../config/nodemailer");
const nodemailer = require("nodemailer");
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN , MY_EMAIL} = process.env;

sendMailRoute.post("/sendOauth", async (req, res) => {
  const accessToken = await oAuth2Client.getAccessToken();
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: MY_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nodemailer Contact 👻" <foo@example.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.redirect("/");
  res.render("contact", { msg: "Email has been sent!" });
});

module.exports = sendMailRoute;
