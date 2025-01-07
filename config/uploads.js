import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const s3 = new S3({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// Function to generate a presigned URL for file upload
export const generatePresignedUrl = async (fileName, fileType, courseId) => {
    try {
        const videoUrl = `uploads/${courseId}/${Date.now()}/videos/${fileName}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: videoUrl,
            ContentType: fileType,
            ACL: "public-read",
        };

        console.log("Generating presigned URL with params:", params);
        // console.log("put object command",command);
        
        const preSignedUrl = await getSignedUrl(s3,new PutObjectCommand(params),{ expiresIn: 60 });
        console.log("returned url",preSignedUrl);
        
        return {videoUrl,preSignedUrl};
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw new Error("Error generating presigned URL: " + error.message);
    }
};

