import amqp from "amqplib";

export const rabbitMq = async () => {

    const queueName: string = "jobs";
    const data: string = process.argv[2];
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(data));

        console.log("job added to queue")

        await channel.close();
        await connection.close();
    }catch(error){
        console.error(error);
    }

}