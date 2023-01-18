import amqp from "amqplib";

(async () => {

    const queueName: string = "jobs";
    const exchaneName: string = "1080p";
    const data: string = process.argv[2];
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        await channel.assertExchange(exchaneName, 'fanout', { durable: false });

        channel.publish(exchaneName, '', Buffer.from(data));
        await channel.close();
        await connection.close();
        // await channel.assertQueue(queueName, {durable: true});
        // channel.sendToQueue(queueName, Buffer.from(data), {persistent: true});

        // console.log("job added to queue")

        // await channel.close();
        // await connection.close();
    }catch(error){
        console.error(error);
    }

})();
