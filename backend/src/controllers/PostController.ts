import { Request, Response} from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { S3 } from "aws-sdk";
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
  
  async function uploadToS3(file: Express.Multer.File, filename: string) {
    try
    {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    console.log(s3)
    return s3.upload(params).promise();
    }
    catch(err)
    {
        console.log(JSON.stringify(err))
    }
  }
const createPost = async(req:Request, res:Response ) =>
{
    try
    {
        console.log(req?.body?.content)

        const media = req.files as Express.Multer.File[]

        for(const file of media)
        {
            const { originalname, mimetype, buffer } = file;
            const extention = mimetype.split("/")[1]
            const filename = uuidv4() + "." + extention
            console.log(filename)
            await uploadToS3(file,filename)
        }
       
        res.status(200).json({
            message:"success fully post created"
        })
    }
    catch(err)
    {
        console.log(JSON.stringify(err))
        res.status(500).json({
            message:"internal server error"
        })
    }
}

export { createPost }