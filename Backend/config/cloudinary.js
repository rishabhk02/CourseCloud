const cloudinary = require("cloudinary").v2;
//**** Cloudinary Configuration to Upload Media ****//
const cloudinaryConnect = () => {
	try {
		cloudinary.config({
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_SECRETE_KEY,
		});
	} catch (error) {
		console.error(error);
	}
};

module.exports = cloudinaryConnect;
