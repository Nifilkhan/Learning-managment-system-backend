import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const upload = new S3({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    }
});


export default upload;