const fs = require('fs');

const convertImageToBase64 = (imagePath) => {
    try {
        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        // Convert the image to a Base64 string
        const base64Image = imageBuffer.toString('base64');
        return base64Image;
    } catch (error) {
        console.error('Error converting image to Base64:', error);
        return null;
    }
};

module.exports = convertImageToBase64;
