#!/usr/bin/env python
import pika
import datetime

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))

channel = connection.channel()

channel.exchange_declare(exchange='gateway', exchange_type='topic')
channel.queue_declare(queue='micro-test.user.store_user_on_signup')

channel.queue_bind(exchange='gateway',
                   queue='micro-test.user.store_user_on_signup',
                   routing_key='circle.gateway.1.command.user.created')




def on_request(ch, method, props, body):
    print("Recibida petición")
    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body="Son las " + str(datetime.datetime.now()))
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='micro-test.user.store_user_on_signup',
                      on_message_callback=on_request)

print(" [x] Awaiting RPC requests")
channel.start_consuming()