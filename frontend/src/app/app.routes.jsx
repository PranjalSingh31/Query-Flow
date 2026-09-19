import { createBrowserRouter } from "react-router";
import Login from "../feature/auth/pages/Login";
import Register from "../feature/auth/pages/Register";
import Dashboard from "../feature/chat/pages/Dashboard";
import Protected from "../feature/components/Protected";
import {Navigate} from "react-router-dom"
export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Protected><Dashboard/></Protected>
    },
    {
        path:"/dashboard",
        element:<Navigate to="/"/>
    }
])
