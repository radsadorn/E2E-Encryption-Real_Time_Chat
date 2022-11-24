import { compare, hash } from "bcrypt";
import { ChatData, ChatResponse, Member, NewChat } from "./chat.interface";

const saltOrRounds = 10;
const chatMemberLimit = 4;

export class ChatService {

    private readonly LOG_NAME = 'ChatService > ';

    chats: { [key: string]: ChatData } = {};

    constructor () {}

    public async createChat(user: Member, newChat: NewChat): Promise<ChatResponse> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(newChat));

            const result = this.chats[newChat.name];
            if (result)
                throw { message: 'Chat Name is already exist!!!' };

            const hashPassword: string = await hash(newChat.password, saltOrRounds)
            const chatData: ChatData = {
                ...newChat,
                password: hashPassword,
                member: [user]
            }
            this.chats[newChat.name] = chatData;
            console.log(this.chats);

            const chatResponse: ChatResponse = {
                name: chatData.name,
                member: chatData.member
            }
            return chatResponse;
        } catch (error: any) {
            throw error;
        }
    }

    public async joinChat(user: Member, chat: NewChat): Promise<ChatResponse> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(chat));

            const result = this.chats[chat.name];
            if (!result)
                throw { message: "No chat found" };

            const isJoined = result.member.find(m => m.username === user.username);
            if (isJoined)
                throw { message: "You already in this chat!!!" };

            if (result.member.length === chatMemberLimit)
                throw { message: "Chat FULL!!!" };

            const password = result.password;
            const chatData: ChatResponse = {
                name: result.name,
                member: result.member
            }

            console.log(chatData.member);

            const passwordCorrected = await compare(chat.password, password);
            if (passwordCorrected) {
                this.chats[chat.name].member.push(user);
                return chatData;
            } 

            throw { message: "Incorrected Password!!" };

        } catch (error: any) {
            throw error;
        }
    }

    public async leaveChat(entity: any): Promise<void> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(entity));

            // find by username
            // username collision
            // const userId
            // const chatId
            
            // delete 

        } catch (error: any) {
            throw error;
        }
    }

    public async newMessage(message: any): Promise<void> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(message));

            // sender
            // receiver
            // chat room
            // content
        } catch(error: any) {
            throw error;
        }
    }

}