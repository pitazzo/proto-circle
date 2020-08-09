import { Channel, connect } from "amqplib";

export class AMQPChannel {
  private static channel: Channel;

  private static async init(): Promise<Channel> {
    const connection = await connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    this.channel = await connection.createChannel();
    await this.channel.assertExchange("gateway", "topic");
    await this.channel.prefetch(1);    
    return this.channel;
  }

  public static async getChannel(): Promise<Channel> {
    return this.channel || this.init();
  }
}
