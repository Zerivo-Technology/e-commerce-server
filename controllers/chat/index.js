const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Server } = require('socket.io');
const io = new Server();

class ChatControllers {
    static async addChat(req, res, next) {
        const SenderId = req.user.id;
        const { receiverId } = req.params;
        const { message } = req.body;

        try {

            if (!SenderId || !receiverId || !message) {
                return res.status(400).json({ error: 'Sender, Receiver, and Message are required.' });
            }


            const receiverExists = await prisma.user.findUnique({
                where: { id: receiverId },
            });
            if (!receiverExists) {
                return res.status(404).json({ error: 'Receiver not found.' });
            }


            const newChat = await prisma.chat.create({
                data: {
                    sender: { connect: { id: SenderId } },
                    receiver: { connect: { id: receiverId } },
                    message: message,
                    readStatus: false,
                },
            });


            io.emit(`chat:${receiverId}`, {
                message: newChat.message,
                senderId: newChat.senderId,
                sentAt: newChat.sentAt,
            });


            res.status(200).json({
                status: 200,
                message: 'Chat added successfully!',
                data: newChat,
            });
        } catch (error) {
            console.error('Error adding chat:', error);
            res.status(500).json({ error: 'An error occurred while adding the chat.' });
        }
    }

    static async deleteChatId(req, res, next) {
        const { chatId } = req.params

        try {
            const deleteChatId = await prisma.chat.delete({
                where: {
                    id: chatId
                }
            })
            res.status(200).json({
                status: 200,
                message: "Delete By Chat",
                data: deleteChatId
            })
            next()
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ChatControllers;
