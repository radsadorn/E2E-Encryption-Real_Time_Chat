import { compare, hash } from "bcrypt";
import { Chat, ChatData, ChatResponse, Member, NewChat } from "./chat.interface";

const saltOrRounds = 10;
const chatMemberLimit = 4;

export class ChatService {

    private readonly LOG_NAME = 'ChatService > ';

    chats: { [key: string]: ChatData } = {};

    constructor () {}

    public async getAllChat(user: Member ): Promise<Chat[]> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(user));

            const allChat = Object.values(this.chats);

            const myChatList = allChat.filter(c => c.member.filter(m => m.username === user.username).length === 1);
            const mapMyChatList = myChatList.map(c => ({ name: c.name, memberCount: c.member.length }));

            // console.log(mapMyChatList);
            return mapMyChatList;
        } catch (error: any) {
            throw error;
        }
    }

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

    public async leaveChat(user: Member, chatName: string): Promise<void> {
        try {
            console.log(this.LOG_NAME + JSON.stringify(chatName));

            const result = this.chats[chatName];
            if (!result)
                throw { message: "No chat found" };

            result.member = result.member.filter(m => m.username !== user.username);
            console.log(result.member);
            console.log(this.chats[chatName].member);

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