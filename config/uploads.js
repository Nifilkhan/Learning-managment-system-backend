import multer from 'multer'
import multerS3 from 'multer-s3'
import { S3 } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const upload = multer({
    storage:multerS3({
        s3:s3,
        bucket:process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata:(req,file,cb) => {
            cb(null,{ fieldName: file.fieldName});
        },
        key:(req,file,cb) => {
            const timeStamp = Date.now();
            cb(null,`uploads/${timeStamp}_${file.originalname}`)
        }
    })
}) 

export default upload;