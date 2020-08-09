import { connect, Channel } from "amqplib";
import { CommandResult } from "../application/commands/command-result";
import { Handler } from "../application/handler";
import { CommandHandler } from "../application/commands/command-handler";
import { QueryHandler } from "../application/queries/query-handler";

export class AMQPController {
  private host: string = "amqp://localhost";
  private exchangeName: string = "gateway";
  private channel: Channel;

  constructor(host: string, exchangeName: string) {
    this.host = host;
    this.exchangeName = exchangeName;
  }

  public async initController(): Promise<void> {
    const connection = await connect(process.env.RABBITMQ_URL || this.host);
    this.channel = await connection.createChannel();
    await this.channel.assertExchange("gateway", "topic");
    await this.channel.prefetch(1);
  }

  public async registerHandler(
    handler: CommandHandler | QueryHandler
  ): Promise<void> {
    await this.channel.assertQueue(handler.getQueueName());
    await this.channel.bindQueue(
      handler.getQueueName(),
      this.exchangeName,
      handler.getEventName()
    );
    await this.channel.consume(handler.getQueueName(), async (msg) => {
      const result = await handler.handle(
        JSON.parse(msg.content.toString())["attributes"]
      );

      this.channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(result)),
        {
          correlationId: msg.properties.correlationId,
        }
      );
      this.channel.ack(msg);
    });
  }
}
