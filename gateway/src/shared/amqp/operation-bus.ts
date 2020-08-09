import { Replies, ConsumeMessage } from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { Stream } from "stream";
import {
  Command,
  Query,
  Operation,
  CommandResult,
  QueryResult,
  AMQPChannel,
} from "circle-core";

class OperationBus {
  private static responsesQueue: Replies.AssertQueue;
  private static requests: Stream;
  private static isInitialized = false;

  private static async init(): Promise<void> {
    const channel = await AMQPChannel.getChannel();
    this.responsesQueue = await channel.assertQueue("", {
      exclusive: true,
    });
    this.requests = new Stream();
    channel.consume(
      this.responsesQueue.queue,
      (msg) => {
        this.requests.emit(
          msg?.properties.correlationId,
          msg as ConsumeMessage
        );
      },
      {
        noAck: true,
      }
    );
    this.isInitialized = true;
  }

  private static async handleOperation(operation: Operation): Promise<any> {
    if (!this.isInitialized) {
      await this.init();
    }
    const correlationId: string = uuidv4();
    let promise = new Promise<any>((resolve) => {
      this.requests.once(correlationId, (msg) => {
        resolve(JSON.parse((msg as ConsumeMessage).content.toString()));
      });
    });
    const channel = await AMQPChannel.getChannel();
    channel.publish(
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

  static async dispatch(command: Command): Promise<CommandResult> {
    const promise = this.handleOperation(command);
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

  static async ask(query: Query): Promise<QueryResult> {
    const promise = this.handleOperation(query);
    return Promise.race([
      promise,
      new Promise<QueryResult>((_, reject) => {
        const timeout = parseInt(process.env.OPERATION_BUS_TIMEOUT || "2000");
        setTimeout(
          () => reject("QueryBus timeout exceeded (" + timeout + " ms)"),
          timeout
        );
      }),
    ]);
  }
}

export default OperationBus;
