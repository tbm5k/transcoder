import aws from 'aws-sdk';
import fs from 'fs';

type UploadResponse = {
    data: string | null;
    error: boolean;
}
//set region
aws.config.update({region: 'eu-west-2'});

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

// the filename receives the full path(destination) of the file, this is both the folder name and the file name 
export const uploadFile = async (imagePath: string, fileName: string, fileType: string): Promise<UploadResponse> => {
    const blob = fs.readFileSync(imagePath)

    try{
        const uploadedMedia = await s3.upload({
            Bucket: "media-in-1080",
            Key: fileName,
            Body: blob,
            ContentType: fileType,
            ContentDisposition: 'inline'
        }).promise()
        return {error: false, data: uploadedMedia.Location}
    }catch(error){
        console.log(error)
        return {error: true, data: null}
    }
    
}
