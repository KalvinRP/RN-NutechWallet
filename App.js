import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NativeBaseProvider } from 'native-base';
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from 'react-query';
import { setAuthToken } from './config/api';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
    const Stack = createStackNavigator()
    const Client = new QueryClient()
    
    const checkUser = async () => {
        try {
          const token = await AsyncStorage.getItem('token')
          if (token !== null) {
            setAuthToken(token);
          }
          return token
        } catch (error) {
          console.log("Error on authentication:", error);
        }
      };
    
      useEffect(() => {
        checkUser();
        // eslint-disable-next-line
      }, []);

    return (
        <QueryClientProvider client={Client}>
            <NativeBaseProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={'Login'}>
                        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                        <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
                        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </NativeBaseProvider>
        </QueryClientProvider>
    )
}
