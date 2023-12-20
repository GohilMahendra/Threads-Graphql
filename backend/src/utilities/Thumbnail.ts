
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import ffprobeinstaller from '@ffprobe-installer/ffprobe';
import ffmpeginstaller from "@ffmpeg-installer/ffmpeg"
import { s3 } from "./S3Utils";

ffmpeg.setFfmpegPath(ffmpeginstaller.path)
ffmpeg.setFfprobePath(ffprobeinstaller.path)

export const generateThumbnail = async (file:Express.Multer.File,filename:string) => {
    
    try {
        const readableStream = Readable.from(file.buffer); 
        const thumbnailStream = ffmpeg()
          .input(readableStream)
          .inputFormat("mp4")
          .outputOptions("-ss", "00:00:02", "-vframes", "1")
          .outputFormat("image2")
          .on("end", () => console.log("Thumbnail generation finished"))
          .on("error", (err) => {
            console.error("Error during thumbnail generation:", err);
            throw Error("Failed to generate thumbnail" );
          })
          .pipe();
        
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME || "",
          Key: filename,
          Body: thumbnailStream,
          ContentType: "image/png", 
        };
        
        return s3.upload(params).promise();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to generate thumbnail");
    }
};
  