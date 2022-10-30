import aws from 'aws-sdk';
import fs from 'fs';

//set region
aws.config.update({region: 'eu-west-2'});

const s3 = new aws.S3({
    accessKeyId: "AKIAXSMZBMHAWL5YCWEB",
    secretAccessKey: "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",
})

// the filename receives the full path(destination) of the file, this is both the folder name and the file name 
export const uploadFile = async (imagePath: string, fileName: string, fileType: string): Promise<string> => {
    const blob = fs.readFileSync(imagePath)

    const uploadedMedia = await s3.upload({
        Bucket: "media-in-1080",
        Key: fileName,
        Body: blob,
        ContentType: fileType,
        ContentDisposition: 'inline'
    }, err => {
        if (err) {
            throw err
        }
    }).promise()

    return uploadedMedia.Location

}
