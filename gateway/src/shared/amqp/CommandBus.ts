import amqp, { Connection, Channel, Replies } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import Command from "../application/Command";
import { Stream } from "stream";
import { plainToClass } from 'class-transformer';
import CommandResult from "../application/CommandResult";

class CommandBus {
  private static _instance: CommandBus;

  private connection!: Connection;
  private channel!: Channel;
  private responsesQueue!: Replies.AssertQueue;
  private requests!: Stream;

  private static async _init() {
    this._instance = new CommandBus();
    this._instance.connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    this._instance.channel = await this._instance.connection.createChannel();
    this._instance.responsesQueue = await this._instance.channel.assertQueue(
      "",
      {
        exclusive: true,
      }
    );
    this._instance.channel.assertExchange("gateway", "topic");
    this._instance.requests = new Stream();
    this._instance.channel.consume(
      this._instance.responsesQueue.queue,
      (msg) => {
        this._instance.requests.emit(
          msg?.properties.correlationId,
          msg as amqp.ConsumeMessage
        );
      }
    );
    return this._instance;
  }

  public static async getInstance() {
    return this._instance || this._init();
  }

  dispatch(operation: Command): Promise<CommandResult> {
    const correlationId: string = uuidv4();

    let promise = new Promise<CommandResult>((resolve) => {
      this.requests.once(correlationId, (msg) => {
        const result = plainToClass(
          CommandResult,
          (msg as amqp.ConsumeMessage).content.toString()
        );
        resolve(result);
      });
    });

    this.channel.publish(
      "gateway",
      operation.getId(),
      Buffer.from(JSON.stringify(operation)),
      {
        correlationId: correlationId,
        replyTo: this.responsesQueue.queue,
      }
    );

    return Promise.race([
      promise,
      new Promise<CommandResult>((_, reject) => {
        const timeout = parseInt(process.env.OPERATION_BUS_TIMEOUT || "2000");
        setTimeout(
          () => reject("CommandBus timeout exceeded (" + timeout + " ms)"),
          timeout
        );
      }),
    ]);
  }
}

export default CommandBus;
