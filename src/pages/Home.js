import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "native-base";
import { setAuthToken } from "../config/api";
import History from "./components/home-history";
import Profile from "./components/home-profile";
import { useQueryClient } from "react-query";
import { useContext } from "react";
import { MyContext } from "../context/MyContext";

export default function Home({ navigation }) {
    const client = useQueryClient()
    const { dispatch } = useContext(MyContext)
    function Logout() {
        try {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
            setAuthToken('')
            client.clear()
            dispatch({
                type: "LOGOUT",
                payload: {},
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <StatusBar />
            <Profile Logout={Logout} />
            <History />
        </>
    )
}