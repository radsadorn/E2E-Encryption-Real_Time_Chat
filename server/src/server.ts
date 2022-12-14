import { app } from './app';
import { initApplication } from './core/app.module';
import Websocket from './modules/websocket/websocket';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = Websocket.getInstance(httpServer);

const port = process.env.PORT || 8000;
const startServer = async () => {

    await initApplication();

    const documents: any[] = [];

    io.on("connection", (socket) => {
        console.log("connected!!!")

        let previousId: string;

        const safeJoin = (currentId: string) => {
            socket.leave(previousId);
            socket.join(currentId);
            console.log(`Socket ${socket.id} joined room ${currentId}`);
            previousId = currentId;
        };

        socket.on("openChannel", (roomName) => {
            safeJoin(roomName);
        });

        socket.on("closeChannel", (roomName) => {
            socket.leave(roomName);
        });

        socket.on("joinChannel", (roomName) => {
            socket.emit('peerJoined', roomName);
        });

        socket.on("leaveChannel", (roomName) => {
            socket.emit('peerLeft', roomName);
            socket.leave(roomName);
        });

        socket.on("sendMessage", (message) => {
            socket.emit('messageReceived', message);
            socket.to(message.chatName).emit('messageReceived', message);
        });

        socket.on("getDoc", docId => {
            safeJoin(docId);
            socket.emit("document", documents[docId]);
        });

        socket.on("addDoc", doc => {
            console.log(!documents[doc.id]);
            documents[doc.id] = doc;
            safeJoin(doc.id);
            io.emit("documents", Object.keys(documents));
            socket.emit("document", doc);
        });

        socket.on("editDoc", doc => {
            documents[doc.id] = doc;
            socket.to(doc.id).emit("document", doc);
        });
    });

    httpServer.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}

startServer();