import * as dotenv from "dotenv";
dotenv.config()

import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfprobePath("/ffmpeg-4.4.2/./ffprobe");

const localMovie = "/mnt/c/Users/teddy/Downloads/videoplayback.mp4";
const hostedMovie = "https://media-fronti.s3.eu-west-2.amazonaws.com/%23MwelekeoniInternet+_+Karibu+to+a+World+of+Possibilities.mp4";

