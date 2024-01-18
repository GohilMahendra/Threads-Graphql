
import AWSSDK from "aws-sdk";
import { Readable } from "stream";

AWSSDK.config.update({
    signatureVersion: 'v4'
});

const CONTENT_EXPIRY_TIME = 60 * 60
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
        Expires: CONTENT_EXPIRY_TIME
    });

    return signedUrl
}
interface ProfilePictureUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Readable;
  }
export const uploadToS3 = async(file:ProfilePictureUpload , filename: string) =>{
    try {


        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: filename,
            Body: file.createReadStream(),
            ContentType: file.mimetype,
        };
        return s3.upload(params).promise();
    }
    catch (err) {
        console.log(JSON.stringify(err))
    }
}
