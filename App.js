import React, { useContext, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MyContextProvider, MyContext } from './src/context/MyContext';
import { NativeBaseProvider } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Register from './src/pages/Register';

export default function App() {
  const client = new QueryClient()
  return (
    <MyContextProvider>
      <QueryClientProvider client={client}>
        <NativeBaseProvider>
          <Routings />
        </NativeBaseProvider>
      </QueryClientProvider>
    </MyContextProvider>
  );
}

function Routings() {
  const Stack = createStackNavigator()
  const {state} = useContext(MyContext)

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={state?.isLogin ? 'Home' : 'Login'}>
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}