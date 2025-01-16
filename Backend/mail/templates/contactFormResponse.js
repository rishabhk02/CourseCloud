const contactUsEmailTemplate = (email, firstname, lastname, message, phoneNo) => {
    return `
    <!DOCTYPE html>
    <html>    
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
        <style>
            body {
                background-color: #f4f4f9;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }    
    
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                text-align: left;
            }
    
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #dddddd;
            }
    
            .newlogo {
                font-size: 24px;
                font-weight: 600;
                color: #0a0a0a;
            }
    
            .message {
                font-size: 20px;
                font-weight: bold;
                margin: 20px 0;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #ffd60a;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }
    
            .cta:hover {
                background-color: #ffcd00;
            }
    
            .support {
                font-size: 14px;
                color: #777777;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
                
            p {
                margin: 10px 0;
            }
        </style>    
    </head>    
    <body>
        <div class="container">
            <div class="header">
                <h1 class="newlogo">CourseCloud</h1>
            </div>
            <div class="message">Contact Form Confirmation</div>
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
                <p>Here are the details you provided:</p>
                <p><span class="highlight">Name:</span> ${firstname} ${lastname}</p>
                <p><span class="highlight">Email:</span> ${email}</p>
                <p><span class="highlight">Phone Number:</span> ${phoneNo}</p>
                <p><span class="highlight">Message:</span> ${message}</p>
                <p>We appreciate your interest and will get back to you shortly.</p>
            </div>
            <div class="support">
                If you have any further questions or need immediate assistance, please feel free to reach
                out to us at <a href="mailto:${process.env.INFO_EMAIL}">${process.env.INFO_EMAIL}</a>. We are here to help!
            </div>
        </div>
    </body>    
    </html>`
}

module.exports = contactUsEmailTemplate;
