
import AWSSDK from "aws-sdk";

AWSSDK.config.update({
    signatureVersion: 'v4'
});

export const s3 = new AWSSDK.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

export const getSignedUrl = async(key:string) =>
{
    const signedUrl  = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    return signedUrl
}

export const uploadToS3 = async(file: Express.Multer.File, filename: string) =>{
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        return s3.upload(params).promise();
    }
    catch (err) {
        console.log(JSON.stringify(err))
    }
}

