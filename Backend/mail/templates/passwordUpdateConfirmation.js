const passwordUpdateEmailTemplate = (email, name) => {
    return `
    <!DOCTYPE html>
    <html>    
    <head>
        <meta charset="UTF-8">
        <title>Password Update Confirmation</title>
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
            <div class="message">Password Update Confirmation</div>
            <div class="body">
                <p>Hey ${name},</p>
                <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.
                </p>
                <p>If you did not request this password change, please contact us immediately to secure your account.</p>
            </div>
            <div class="support">
                If you have any questions or need further assistance, please feel free to reach out to us
                at <a href="mailto:${process.env.INFO_EMAIL}">${process.env.INFO_EMAIL}</a>. We are here to help!
            </div>
        </div>
    </body>    
    </html>`;
};

module.exports = passwordUpdateEmailTemplate;
