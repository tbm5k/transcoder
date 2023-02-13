import * as dotenv from "dotenv";
import amqp, { ConsumeMessage } from "amqplib";
import ffmpeg from "fluent-ffmpeg";
var getDimensions = require('get-video-dimensions')
dotenv.config();

(async () => {
    const exchangeName: string = "1080p";

    try {
        const amqpServer = "amqp://localhost:5672";
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        /*
        we declare the queue because we might start the consumer 
        before the publisher therefore this makes sure that the queue exists
        */
        // await channel.assertQueue(queueName, {durable: true}); 
        // await channel.prefetch(1); //option allows the worker not be overloaded with messages if it's not completed a work
        // await channel.consume(queueName, (message) => {
        //     const data = message?.content.toString();
        //     console.log("data", data);

        //     channel.ack(message!);
        //     console.log("Acknowledged!");
        // });

        await channel.assertExchange(exchangeName, 'fanout', { durable: false });
        const assertedQueue = await channel.assertQueue('', { exclusive: true });

        await channel.bindQueue(assertedQueue.queue, exchangeName, '');

        await channel.consume(assertedQueue.queue, async (message: ConsumeMessage | null) => {
            if(message?.content) {
                console.log(message.content.toString())
                // const stream = fs.createWriteStream(`/mnt/c/Users/teddy/Desktop${message.content.toString()}`);
                const fileName = message.content.toString();
                
                const dimensions = await getDimensions(fileName);
                console.log("dimensions: ", dimensions)

                switch(dimensions.height){
                    case 2160:
                        transcode(fileName, 2560, 1440);
                        transcode(fileName, 1920, 1080);
                        transcode(fileName, 1280, 720);
                        transcode(fileName, 640, 480);
                        transcode(fileName, 640, 360);
                    default:
                        console.log("Resolution not in range")

                }
                channel.ack(message);
            };
        })

    } catch (error) {
        console.log(error);
    }
})();

const transcode = (fileName: string, width: number, height: number) => {
    /*
    1920x1080
    h = 1080
    */
    ffmpeg(fileName)
    .output(`${process.env.COMPRESSED_DIR}${fileName.split("videos")[1]}`)
    .size(`${width}x${height}`)
    .on("start", command => {
        console.log(command)
    })
    .run();
}
