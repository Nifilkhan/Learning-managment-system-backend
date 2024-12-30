import upload from "../config/uploads.js";

// Function to generate a presigned URL for file upload
export const generatePresignedUrl = (fileName,fileType) => {
    const params = {
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:`uploads/${Date.now()}_${fileName}`,
        Expires:60,
        ContentType:fileType,
        ACL:`public-read`
    };

    return upload.getSignedUrl('putObject',params);
}