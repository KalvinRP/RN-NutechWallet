import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "native-base";
import { useQueryClient } from "react-query";
import History from "./components/home-history";
import Profile from "./components/home-profile";

export default function Home({ navigation, Client }) {
    const queryClient = useQueryClient()
    async function Logout() {
        await AsyncStorage.removeItem('token')
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        queryClient.clear()
        
    }

    return (
        <>
        <StatusBar />
        <Profile Logout={Logout} />
        <History />
        </>
    )
}