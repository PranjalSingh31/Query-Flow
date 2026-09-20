import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null,

    },
    reducers:{
        setChats:(state,action)=>{
            state.chats = action.payload
        },
        upsertChat:(state,action)=>{
            const chat = action.payload
            state.chats[chat._id] = {
                ...state.chats[chat._id],
                ...chat
            }
        },
        removeChat:(state,action)=>{
            const chatId = action.payload
            delete state.chats[chatId]

            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId = action.payload
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        }
    }
})

export const {setChats,upsertChat,removeChat,setCurrentChatId,setLoading,setError} = chatSlice.actions

export default chatSlice.reducer


// chats = {
//     "docker and AWS":{
//         messages:[
//             {
//                 role:"user",
//                 content:"What is Docker"
//             },
//             {
//                 role:"ai",
//                 content:"Docker is a platform that allows developers to automate the deployment of applications inside lightweight, portable containers. It enables applications to run consistently across different environments, making it easier to develop, ship, and run software."
//             }
//         ],
//         id:"docker and AWS",
//         lastUpdated:"2023-09-15T12:34:56Z"
//     }
// }
