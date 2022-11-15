const Reservation = require("../Models/Reservation");
const Customer = require("../Models/Customer");

const nodemailer = require("nodemailer");
const { randomBytes } = require("crypto");
const { join } = require("path");

DOMAIN = process.env.APP_DOMAIN;
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d9ca72c3cda801",
    pass: "5990b50fd44d7f",
  },
});

module.exports = {
  async createReservation(req, res) {
    try {
      const newReservation = new Reservation(req.body);
      newReservation.confirmationCode = randomBytes(6).toString("hex");
      //calculate number of days between checkIn , checkOut attributes:
      const nightsNumber = newReservation.checkOut.getTime() - newReservation.checkIn.getTime();
        newReservation.nights=nightsNumber / 1000 / 60 / 60 / 24
      await newReservation.save();
      //relation:
      await Customer.findByIdAndUpdate(
        { _id: req.body.customer },
        { $push: { reservations: newReservation } }
      );

      res.status(200).json({
        status: 200,
        nights:newReservation.nights,
        message: "reservation created successfully!! ,check your email !",
      });
      //send an email for confirmation
      const customer = await Customer.findById({ _id: req.body.customer });
      await transport.sendMail(
        {
          to: customer.email,
          subject: "your reservation confirm email",
          text: "welcome " + customer.fullname,
          html: `
         <!DOCTYPE html>
         <html>
           <head>
             <meta charset="utf-8" />
             <meta http-equiv="x-ua-compatible" content="ie=edge" />
             <title>Email Confirmation</title>
             <meta name="viewport" content="width=device-width, initial-scale=1" />
             <style type="text/css">
               /**
            * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
            */
               @media screen {
                 @font-face {
                   font-family: "Source Sans Pro";
                   font-style: normal;
                   font-weight: 400;
                   src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                     url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                       format("woff");
                 }
                 @font-face {
                   font-family: "Source Sans Pro";
                   font-style: normal;
                   font-weight: 700;
                   src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                     url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                       format("woff");
                 }
               }
               /**
            * Avoid browser level font resizing.
            * 1. Windows Mobile
            * 2. iOS / OSX
            */
               body,
               table,
               td,
               a {
                 -ms-text-size-adjust: 100%; /* 1 */
                 -webkit-text-size-adjust: 100%; /* 2 */
               }
               /**
            * Remove extra space added to tables and cells in Outlook.
            */
               table,
          
           /**
            * Better fluid images in Internet Explorer.
            */
           img {
                 -ms-interpolation-mode: bicubic;
               }
               /**
            * Remove blue links for iOS devices.
            */
               a[x-apple-data-detectors] {
                 font-family: inherit !important;
                 font-size: inherit !important;
                 font-weight: inherit !important;
                 line-height: inherit !important;
                 color: inherit !important;
                 text-decoration: none !important;
               }
               /**
            * Fix centering issues in Android 4.4.
            */
               div[style*="margin: 16px 0;"] {
                 margin: 0 !important;
               }
               body {
                 width: 100% !important;
                 height: 100% !important;
                 padding: 0 !important;
                 margin: 0 !important;
               }
               /**
            * Collapse table borders to avoid space between cells.
            */
               table {
                 border-collapse: collapse !important;
               }
               a {
                 color: #1a82e2;
               }
               img {
                 height: auto;
                 line-height: 100%;
                 text-decoration: none;
                 border: 0;
                 outline: none;
               }
             </style>
           </head>
           <body style="background-color: #e9ecef">
             <!-- start preheader -->
             <div
               class="preheader"
               style="
                 display: none;
                 max-width: 0;
                 max-height: 0;
                 overflow: hidden;
                 font-size: 1px;
                 line-height: 1px;
                 color: #fff;
                 opacity: 0;
               "
             >
               A preheader is the short summary text that follows the subject line when
               an email is viewed in the inbox.
             </div>
             <!-- end preheader -->
         
             <!-- start body -->
             <table border="0" cellpadding="0" cellspacing="0" width="100%">
               <!-- start logo -->
               <tr>
                 <td align="center" bgcolor="#e9ecef">
                   <!--[if (gte mso 9)|(IE)]>
                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                 <tr>
                 <td align="center" valign="top" width="600">
                 <![endif]-->
                   <table
                     border="0"
                     cellpadding="0"
                     cellspacing="0"
                     width="100%"
                     style="max-width: 600px"
                   >
                     <tr>
                       <td align="center" valign="top" style="padding: 36px 24px">
                         <a
                           href="https://www.blogdesire.com"
                           target="_blank"
                           style="display: inline-block"
                         >
                           <img
                             src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png"
                             alt="Logo"
                             border="0"
                             width="48"
                             style="
                               display: block;
                               width: 48px;
                               max-width: 48px;
                               min-width: 48px;
                             "
                           />
                         </a>
                       </td>
                     </tr>
                   </table>
                   <!--[if (gte mso 9)|(IE)]>
                 </td>
                 </tr>
                 </table>
                 <![endif]-->
                 </td>
               </tr>
               <!-- end logo -->
         
               <!-- start hero -->
               <tr>
                 <td align="center" bgcolor="#e9ecef">
                   <!--[if (gte mso 9)|(IE)]>
                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                 <tr>
                 <td align="center" valign="top" width="600">
                 <![endif]-->
                   <table
                     border="0"
                     cellpadding="0"
                     cellspacing="0"
                     width="100%"
                     style="max-width: 600px"
                   >
                     <tr>
                       <td
                         align="left"
                         bgcolor="#ffffff"
                         style="
                           padding: 36px 24px 0;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           border-top: 3px solid #d4dadf;
                         "
                       >
                         <h1
                           style="
                             margin: 0;
                             font-size: 32px;
                             font-weight: 700;
                             letter-spacing: -1px;
                             line-height: 48px;
                           "
                         >
                           Confirm Your Email Address
                         </h1>
                       </td>
                     </tr>
                   </table>
                   <!--[if (gte mso 9)|(IE)]>
                 </td>
                 </tr>
                 </table>
                 <![endif]-->
                 </td>
               </tr>
               <!-- end hero -->
         
               <!-- start copy block -->
               <tr>
                 <td align="center" bgcolor="#e9ecef">
                   <!--[if (gte mso 9)|(IE)]>
                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                 <tr>
                 <td align="center" valign="top" width="600">
                 <![endif]-->
                   <table
                     border="0"
                     cellpadding="0"
                     cellspacing="0"
                     width="100%"
                     style="max-width: 600px"
                   >
                     <!-- start copy -->
                     <tr>
                       <td
                         align="left"
                         bgcolor="#ffffff"
                         style="
                           padding: 24px;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           font-size: 16px;
                           line-height: 24px;
                         "
                       >
                         <p style="margin: 0">
                           Tap the button below to confirm your email address. If you
                           didn't create an account with
                           <a href="https://blogdesire.com">Paste</a>, you can safely
                           delete this email.
                         </p>
                       </td>
                     </tr>
                     <!-- end copy -->
         
                     <!-- start button -->
                     <tr>
                       <td align="left" bgcolor="#ffffff">
                         <table border="0" cellpadding="0" cellspacing="0" width="100%">
                           <tr>
                             <td align="center" bgcolor="#ffffff" style="padding: 12px">
                               <table border="0" cellpadding="0" cellspacing="0">
                                 <tr>
                                   <td
                                     align="center"
                                     bgcolor="#1a82e2"
                                     style="border-radius: 6px"
                                   >
                                     <a
                                       href="${DOMAIN}Reservation/confirmReservation/${newReservation.confirmationCode}"
                                       target="_blank"
                                       style="
                                         display: inline-block;
                                         padding: 16px 36px;
                                         font-family: 'Source Sans Pro', Helvetica, Arial,
                                           sans-serif;
                                         font-size: 16px;
                                         color: #ffffff;
                                         text-decoration: none;
                                         border-radius: 6px;
                                       "
                                       >Do Something Sweet</a
                                     >
                                   </td>
                                 </tr>
                               </table>
                             </td>
                           </tr>
                         </table>
                       </td>
                     </tr>
                     <!-- end button -->
         
                     <!-- start copy -->
                     <tr>
                       <td
                         align="left"
                         bgcolor="#ffffff"
                         style="
                           padding: 24px;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           font-size: 16px;
                           line-height: 24px;
                         "
                       >
                         <p style="margin: 0">
                           If that doesn't work, copy and paste the following link in
                           your browser:
                         </p>
                         <p style="margin: 0">
                           <a href="https://blogdesire.com" target="_blank"
                             >https://blogdesire.com/xxx-xxx-xxxx</a
                           >
                         </p>
                       </td>
                     </tr>
                     <!-- end copy -->
         
                     <!-- start copy -->
                     <tr>
                       <td
                         align="left"
                         bgcolor="#ffffff"
                         style="
                           padding: 24px;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           font-size: 16px;
                           line-height: 24px;
                           border-bottom: 3px solid #d4dadf;
                         "
                       >
                         <p style="margin: 0">
                           Cheers,<br />
                           Paste
                         </p>
                       </td>
                     </tr>
                     <!-- end copy -->
                   </table>
                   <!--[if (gte mso 9)|(IE)]>
                 </td>
                 </tr>
                 </table>
                 <![endif]-->
                 </td>
               </tr>
               <!-- end copy block -->
         
               <!-- start footer -->
               <tr>
                 <td align="center" bgcolor="#e9ecef" style="padding: 24px">
                   <!--[if (gte mso 9)|(IE)]>
                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                 <tr>
                 <td align="center" valign="top" width="600">
                 <![endif]-->
                   <table
                     border="0"
                     cellpadding="0"
                     cellspacing="0"
                     width="100%"
                     style="max-width: 600px"
                   >
                     <!-- start permission -->
                     <tr>
                       <td
                         align="center"
                         bgcolor="#e9ecef"
                         style="
                           padding: 12px 24px;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           font-size: 14px;
                           line-height: 20px;
                           color: #666;
                         "
                       >
                         <p style="margin: 0">
                           You received this email because we received a request for
                           [type_of_action] for your account. If you didn't request
                           [type_of_action] you can safely delete this email.
                         </p>
                       </td>
                     </tr>
                     <!-- end permission -->
         
                     <!-- start unsubscribe -->
                     <tr>
                       <td
                         align="center"
                         bgcolor="#e9ecef"
                         style="
                           padding: 12px 24px;
                           font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                           font-size: 14px;
                           line-height: 20px;
                           color: #666;
                         "
                       >
                         <p style="margin: 0">
                           To stop receiving these emails, you can
                           <a href="https://www.blogdesire.com" target="_blank"
                             >unsubscribe</a
                           >
                           at any time.
                         </p>
                         <p style="margin: 0">
                           Paste 1234 S. Broadway St. City, State 12345
                         </p>
                       </td>
                     </tr>
                     <!-- end unsubscribe -->
                   </table>
                   <!--[if (gte mso 9)|(IE)]>
                 </td>
                 </tr>
                 </table>
                 <![endif]-->
                 </td>
               </tr>
               <!-- end footer -->
             </table>
             <!-- end body -->
           </body>
         </html>
         
                           
                         `,
        },
        (err, sent) => {
          if (err) {
            console.log(err.message + ": not sent");
          } else {
            console.log("email sent ");
          }
        }
      );
    } catch (error) {
      res.status(404).json({
        status: 404,
        msg: "failed to create a reservation ",
        error: error.message,
      });
      //  console.log(error.message)
    }
  },
  async confirmReservation(req, res) {
    try {
      const reservation = await Reservation.findOne({
        confirmationCode: req.params.confCode,
      });
      reservation.confirmed = true;
      reservation.confirmationCode = undefined;
      reservation.save();
      res.sendFile(join(__dirname, "../Templates/success.html"));
    } catch (error) {
      res.sendFile(join(__dirname, "../Templates/error.html"));
    }
  },
  async deleteReservation(req, res) {
    try {
      const reservation = await Reservation.findById({ _id: req.params.id });
      console.log(reservation);
      //await Reservation.findByIdAndUpdate(reservation.customer,{$pull:{reservations:req.params.id}})
      await Reservation.findOneAndUpdate(reservation.customer, {
        $pull: { reservations: req.params.id },
      });

      await Reservation.deleteOne({ _id: req.params.id });
      res.status(200).json({
        status: 200,
        message: "reservation deleted successfully!!",
      });
    } catch (error) {
      res.status(404).json({
        status: 404,
        message: "failed to delete a reservation!!",
        error: error.message,
      });
    }
  },
  async getReservationById(req, res) {
    try {
      const reservation = await Reservation.findById({ _id: req.params.id });
      res.status(200).json({
        status: 200,
        message: "Reservation by Id:",
        data: reservation,
      });
    } catch (error) {
      res.status(404).json({
        status: 200,
        message: "failed to get reservation by id!",
        error: error.message,
      });
    }
  },
  async getAllReservation(req, res) {
    try {
      res.status(200).json({
        status: 200,
        message: "list of all reservations:",
        data: await Reservation.find({}),
      });
    } catch (error) {
      res.status(404).json({
        status: 404,
        message: "failed to get all reservations",
        error: error.message,
      });
    }
  },
  async updateReservation(req, res) {
    try {
    } catch (error) {}
  },
};