import axios from "axios";
import fs from "fs";
import path from "path";

export const download = async (url, assetPath) => {
    try{
        let progress = 0;
        const {data, headers} = await axios({url, method: 'GET', responseType: 'stream'});
        const length = headers['content-length'];
        // console.log(headers)

        const writer = fs.createWriteStream(path.resolve('videos', 'test.mp4'))
        data.on('data', chunk => {
            progress = progress + (chunk.length/length) * 100;
            console.log(`chunk received: ${Math.floor(progress)}%`)
        });
        data.pipe(writer)
        // console.log("the data", data)        
        // console.log(writer.path)
        return writer.path;
    }catch(error){
        console.error(error)
    }
}  
