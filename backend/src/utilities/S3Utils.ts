
import AWSSDK from "aws-sdk";

AWSSDK.config.update({
    signatureVersion: 'v4'
});

const CONTENT_EXPIRY_TIME = 60 * 60
export const s3 = new AWSSDK.S3({
    accessKeyId: "AKIAUA2QJHDUT23ASBBD",
    secretAccessKey: "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",
    region: "ap-south-1"
});

export const getSignedUrl = async(key:string) =>
{
    const signedUrl  = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: CONTENT_EXPIRY_TIME
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
