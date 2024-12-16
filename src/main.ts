import 'dotenv/config';
import {Server} from "./nats/server";

async function main() {
    console.log('Hello, world!');
    const server = new Server();
    await server.establishConnection();
    // then run a process that gets the messages off of the queue
    await server.subscribe("potato.masher");
}

main().then(() => console.log('Goodbye, world!'));