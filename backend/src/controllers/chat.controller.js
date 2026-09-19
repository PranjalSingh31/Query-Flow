import { generateResponse, generateChatTitle } from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"

export async function sendMessage(req, res) {
    const { message, chat: chatId } = req.body

    if (!message || !message.trim()) {
        return res.status(400).json({
            message: "Message is required",
            success: false,
            err: "Empty message"
        })
    }

    const userId = req.user?.userId || req.user?._id

    if (!userId) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "User not authenticated"
        })
    }

    try {
        let chat
        let result
        let previousMessages = []

        if (!chatId) {
            const title = await generateChatTitle(message)
            chat = await chatModel.create({
                user: userId,
                title
            })
        } else {
            chat = await chatModel.findById(chatId)

            if (!chat) {
                return res.status(404).json({
                    message: "Chat not found",
                    success: false,
                    err: "Invalid chat id"
                })
            }

            if (!chat.user || String(chat.user) !== String(userId)) {
                return res.status(403).json({
                    message: "Forbidden",
                    success: false,
                    err: "This chat does not belong to you"
                })
            }

            previousMessages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 })
        }

        const allChatMessages = [
            ...previousMessages.map((msg) => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: "user",
                content: message
            }
        ]

        result = await generateResponse(allChatMessages)

        const userMessage = await messageModel.create({
            chat: chat._id,
            content: message,
            role: "user"
        })

        const aiMessage = await messageModel.create({
            chat: chat._id,
            content: result,
            role: "ai"
        })

        const allMessages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 })

        return res.json({
            message: result,
            chat: chat._id,
            title: chat.title,
            userMessage,
            aiMessage,
            messages: allMessages
        })
    } catch (error) {
        console.error("Chat generation failed:", error)

        return res.status(500).json({
            message: "Failed to generate chat response.",
            success: false,
            err: error.message
        })
    }
}

export async function getChats(req, res){
    const user = req.user

    const chats = await chatModel.find({user:user.userId})

    res.status(200).json({
        message:"chats retrieved successfully",
        chats
    })
}

export async function getMessages(req,res){
    const {chatId} = req.params

    const chat = await chatModel.findById(chatId)

    if(!chat)
    {
        return res.status(404).json({
            message:"Chat not found",

        })
    }

    const message = await messageModel.find({chat:chatId})

    res.status(200).json({
        message:"messages retrieved successfully",
        messages:message
    })
}

export async function deleteChat(req,res){
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({_id:chatId,user:req.user.userId})

    await messageModel.deleteMany({chat:chatId})

    if(!chat)
    {
        return res.status(404).json({
            message:"Chat not found",
            success: false
        })
    }

    res.status(200).json({
        message:"chat deleted successfully",
        chat
    })

}