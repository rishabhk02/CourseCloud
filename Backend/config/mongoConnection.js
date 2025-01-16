const mongoose = require("mongoose");
//**** MongoDb Database Connection For Data Storage ****//
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL, { useNewUrlparser: true });
		console.log('Database Connection Successfull');
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

module.exports = connectDB;