const asyncHandler = require("express-async-handler");

const uploadImageToS3 = asyncHandler(async (req, res) => {
    const file = req.file;
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    // Set up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    // Upload file to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error uploading file to S3" });
        }
        res.status(200).json({ imageUrl: data.Location });
    });
}   );

module.exports = {uploadImageToS3}; 