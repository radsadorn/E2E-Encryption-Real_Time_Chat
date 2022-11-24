import { Router } from "express";
import { doRequest } from "../core/process/process.module";
import { ChatController } from "../modules/chat/chat.controller";

export const appRouter = Router();
const chatController = new ChatController();

appRouter.get('/hello', (req, res) => {
    res.send('Hello chat!!!');
});

appRouter.post('/', doRequest((req, res) => chatController.createChat(req, res)));
appRouter.put('/', doRequest((req, res) => chatController.joinChat(req, res)));