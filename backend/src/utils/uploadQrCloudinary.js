// utils/uploadQrToCloudinary.js
const cloudinary = require("../config/cloudinary");

const uploadQrToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "qr-codes",
        public_id: publicId,
        resource_type: "image",
        format: "png",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.log("Full Cloudinary error:", JSON.stringify(error, null, 2));

          console.log("reolve : ", error);
          return reject(error);
        }
        resolve(result);

        console.log(result);
      },
    );
    stream.end(buffer);
  });
};

module.exports = uploadQrToCloudinary;
