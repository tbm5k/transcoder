import amqp from "amqplib";

export const consumer = async () => {
    const queueName: string = "jobs";

    try {
        const amqpServer = "amqp://localhost:5672";
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        /*
        we declare the queue because we might start the consumer 
        before the publisher therefore this makes sure that the queue exists
        */
        await channel.assertQueue(queueName); 
        await channel.consume(queueName, (message) => {
            const data = message?.content.toString();
            console.log("data", data);

            channel.ack(message!);
            console.log("Acknowledged!");
        });
    } catch (error) {
        console.log(error);
    }
};
