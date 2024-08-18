import { Request, Response } from "express-serve-static-core";
import prisma from "../db/prisma.js";
import { error } from "console";

export const sendMessage = async ( req: Request, res: Response ) => {
    try{
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // leter etter om det eksisterer en samtale
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                }
            }
        })
        // hvis det ikke finnes en samtale, da er dette starten på en samtale
        if(!conversation){
            conversation = await prisma.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId]
                    }
                }
            })
        }
        //lager meldingen
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        });
        // legger melding i samtalen.
        if(newMessage){
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }

        res.status(201).json(newMessage)
    } catch(error: any){
        console.error("Error in sendMessage", error.message);
        res.status(500).json({ erorr: "Server Error"});
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try{
        const{id: userToChatId} = req.params;
        const senderId = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery:[senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy:{
                        createdAt: "asc"
                    }
                }
            }
        })
        if(!conversation){
            return res.status(200).json([])
        }
        res.status(200).json(conversation.messages);
    }catch(error: any){
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
};

export const getUsersAsAList = async ( req: Request, res: Response ) => {
    try{
        const authUserId = req.user.id
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            }

        })
        res.status(200).json(users)
    }catch(error: any) {
        console.error("Error in getUsersAsAList: ", error.message);
        res.status(500).json({error : "Server Error"});
    }
}