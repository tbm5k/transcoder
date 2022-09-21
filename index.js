import ffmpeg from "fluent-ffmpeg";
import {download} from "./src/utils/helpers/imageDownloader.util.js";

ffmpeg.setFfprobePath("/ffmpeg-4.4.2/./ffprobe");

const localMovie = "/mnt/c/Users/teddy/Downloads/videoplayback.mp4";
const hostedMovie = "https://media-fronti.s3.eu-west-2.amazonaws.com/%23MwelekeoniInternet+_+Karibu+to+a+World+of+Possibilities.mp4";
const downloadPath = "test.mp4";
//download file
const ev = async () => {

    const thePath = await download(hostedMovie, downloadPath);
    //pass the path to the downloaded asset
    ffmpeg.ffprobe(thePath, (error, metadata) => {
        if(!error){
            console.log("Width: ", metadata.streams[0].width)
            console.log("Height: ", metadata.streams[0].height)
        }
    })
}

ev()