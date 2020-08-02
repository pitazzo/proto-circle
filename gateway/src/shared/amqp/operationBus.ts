import amqp, { Connection, Channel, Replies } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import Operation from "../application/operation";

class OperationBus {
  private static _instance: OperationBus;

  private connection!: Connection;
  private channel!: Channel;
  private responsesQueue!: Replies.AssertQueue;

  private static async _init() {
    this._instance = new OperationBus();
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
    this._instance.channel.assertExchange("gateway-exchange", "topic");
    return this._instance;
  }

  public static async getInstance() {
    return this._instance || this._init();
  }

  dispatch(operation: Operation): Promise<any> {
    const correlationId: string = uuidv4();

    let promise = new Promise((resolve, reject) => {
      this.channel.consume(this.responsesQueue.queue, (msg) => {
        console.log(msg?.content.toString());
        if (msg?.properties.correlationId === correlationId) {
          resolve(msg.content.toString);
        }
      });
      setTimeout(() => {
        reject("Operation bus timeout");
      }, parseInt(process.env.OPERATION_BUS_TIMEOUT || "2000"));
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

    return promise;
  }
}

export default OperationBus;
