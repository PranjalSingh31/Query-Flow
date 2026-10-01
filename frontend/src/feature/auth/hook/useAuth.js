import {useDispatch} from "react-redux"
import { login,register,getMe } from "../service/auth.api"
import { setUser,setLoading,setError } from "../service/auth.slice"


export function useAuth(){
    const dispatch = useDispatch()

    async function handleRegister({email,username,password})
    {
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            return await register({email,username,password})
        }catch(error)
        {
            const details = error.response?.data?.errors?.map((item) => item.msg).join(', ')
            dispatch(setError(error.response?.data?.message || details || "Registration failed"))
            return null
        } finally{
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email,password})
    {
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({email,password})
            dispatch(setUser(data.user))
            return true
        }catch(err)
        {
            dispatch(setError(err.response?.data?.message || "login failed"))
            return false
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe(){
        try{
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getMe()
            dispatch(setUser(data.user))
            dispatch(setError(null))
        }
        catch (err)
        {
            if (err.response?.status === 401) {
                dispatch(setUser(null))
                dispatch(setError(null))
                return false
            }
            dispatch(setError(err.response?.data?.message || "failed to fetch user data"))
            return false
        }finally{
            dispatch(setLoading(false))
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
}
