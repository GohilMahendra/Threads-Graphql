
import AWSSDK from "aws-sdk";
import { Readable } from "stream";

AWSSDK.config.update({
    signatureVersion: 'v4'
});

export interface ProfilePictureUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Readable;
}
const CONTENT_EXPIRY_TIME = 60 * 60
export const s3 = new AWSSDK.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.envAWS_REGION.
});

export const getSignedUrl = async (key: string) => {
    const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
    });

    return signedUrl
}

export const uploadToS3 = async (file: ProfilePictureUpload, filename: string) => {
    try {
        console.log(file)
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || "",
            Key: filename,
            Body: file.createReadStream(),
            ContentType: file.mimetype,
        };
        return s3.upload(params).promise().catch(err => console.log(err, "errorin in s23"));
    }
    catch (err) {
        console.log(JSON.stringify(err), "Error in uploading stream")
    }
}
