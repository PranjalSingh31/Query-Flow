import { initiliazedSocketConnection } from "../service/chat.socket";   
import {sendMessage as sendMessageApi,getChats,getMessages,deleteChat} from "../service/chat.api"

import {setChats,setCurrentChatId,setError,setLoading,upsertChat} from "../chat.slice"
import {useDispatch} from "react-redux"

export const useChat = () =>{
    const dispatch = useDispatch()

    async function handleSendMessage({message,chatId}){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await sendMessageApi({message,chatId})
            const {chat,title,messages} = data

            dispatch(upsertChat({
                _id: chat,
                title,
                messages,
            }))
            dispatch(setCurrentChatId(chat))

            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "failed to send message"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }

    }

    async function handleGetChats(){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await getChats()
            const chats = data.chats.reduce((acc,chat)=>{
                acc[chat._id] = {
                    ...chat,
                    messages: chat.messages || []
                }
                return acc
            }, {})

            dispatch(setChats(chats))

            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "failed to get chats"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleSelectChat(chatId){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            dispatch(setCurrentChatId(chatId))

            const data = await getMessages(chatId)

            dispatch(upsertChat({
                _id: chatId,
                messages: data.messages || []
            }))

            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "failed to get messages"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    function handleNewChat(){
        dispatch(setCurrentChatId(null))
    }

    return{
        initiliazedSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleSelectChat,
        handleNewChat,
        getChats,
        getMessages,
        deleteChat
    }
}
