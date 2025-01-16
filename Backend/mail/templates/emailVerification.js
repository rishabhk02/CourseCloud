const otpEmailTemplate = (otp) => {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <title>OTP Verification Email</title>
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
		<div class="message">OTP Verification Email</div>
		<div class="body">
		  <p>Dear User,</p>
		  <p>Thank you for registering with CourseCloud. To complete your registration, please use the following OTP
			(One-Time Password) to verify your account:</p>
		  <h2 class="highlight">${otp}</h2>
		  <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
			Once your account is verified, you will have access to our platform and its features.</p>
		</div>
		<div class="support">
		  If you have any questions or need assistance, please feel free to reach out to us at 
		  <a href="mailto:${process.env.INFO_EMAIL}">${process.env.INFO_EMAIL}</a>. We are here to help!
		</div>
	  </div>
	</body>  
	</html>`;
};

module.exports = otpEmailTemplate;
