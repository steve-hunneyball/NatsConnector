import {connect, ConnectionOptions, NatsConnection, StringCodec} from 'nats';

export class Server {
    server: ConnectionOptions = {
        servers: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PASSWORD,
    };
    connection: NatsConnection | null;

    constructor() {
        this.connection = null;
    };

    async establishConnection() {
        try {
            this.connection = await connect(this.server);
            console.log(`Established connection to ${this.connection.getServer()}`);
        } catch (err) {
            console.log(`Error establishing connection to ${JSON.stringify(this.server)}`);
            console.error(err);
        }
    }

    async publishMessage(topic: string, message: string) {
        if (!this.connection) {
            console.error(`Cannot publish message - no connection`);
            return;
        }
        this.connection.publish(topic, JSON.stringify(message));
    }

    async pullMessage(topic: string, message: string) {console.log("Unimplemented.");};

    async subscribe(subject: string) {
        if (!this.connection) {
            console.error(`Cannot subscribe message - no connection`);
            return;
        }
        const codec = StringCodec();
        const subscription = this.connection.subscribe(subject, {
            callback: (err, msg) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(codec.decode(msg.data));
                }
            },
        });

        subscription
            .closed
            .then(() => console.log(`Subscription closed`))
            .catch(err => console.error(`Subscription closed with an error: ${err}`));
    }
}