import amqp, { ConsumeMessage } from "amqplib";
import ffmpeg from "fluent-ffmpeg";

// const fluent = ffmpeg();

(async () => {
    const queueName: string = "jobs";
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

        await channel.consume(assertedQueue.queue, (message: ConsumeMessage | null) => {
            if(message?.content) {
                console.log(message.content.toString())
                ffmpeg(message.content.toString()).output("~/videos/reduced.mp4").size('1080x720');
                channel.ack(message);
            };
        })

    } catch (error) {
        console.log(error);
    }
})();
