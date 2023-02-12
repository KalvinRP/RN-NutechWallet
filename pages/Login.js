import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "@react-navigation/native";
import { Button, Center, FormControl, Image, Input, Square, Stack } from "native-base";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useMutation } from "react-query";
import { API } from "../config/api";
import { styles } from "../Stylesheet";

export default function Login({ navigation }) {
  const validEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
  const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/
  const [invalid, setInvalid] = useState({
    email: false,
    password: false
  })

  const [login, setLogin] = useState({
    email: "",
    password: "",
  })

  const signing = (key, value) => {
    setLogin({
      ...login,
      [key]: value,
    });
    setInvalid({
      email: false,
      password: false
    })
  }

  const LogSubmitted = useMutation(async (e) => {
    try {
      if (validEmail.test(login.email) && validPassword.test(login.password)) {
        setInvalid({
          email: false,
          password: false
        })
        const response = await API.post('/login', login);
        if (response.data.status === 0) {
          await AsyncStorage.setItem('token', response.data.data.token)
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
      }
    } else {
      if (!validEmail.test(login.email)) { setInvalid({ email: true }) }
      if (!validPassword.test(login.password)) { setInvalid({ password: true }) }
      if (!validEmail.test(login.email) && !validPassword.test(login.password)) { setInvalid({ email: true, password: true }) }
    }
  } catch (error) {
    if (error.response.data.status === 102) {
      alert(error.response.data.message + '!')
    }
  }
});

return (
  <>
    <ScrollView>
      <Center>
        <Image source={require('../assets/splash.png')} alt="loading" style={styles.entranceImage} />
      </Center>
      <Text style={styles.entranceTitle}>Masuk</Text>
      <FormControl>
        <Square>
          <Stack space={5} w="85%" mt={30}>
            <Stack>
              <Input type={'text'} value={login.email} onChangeText={(value) => signing("email", value)} size="lg" variant="outline" style={styles.bgTextInput} p={2} placeholder="Surel" />
              {invalid.email && <Text style={{ color: 'red' }}>Surel tidak berlaku. Harap periksa kembali.</Text>}
            </Stack>
            <Stack>
              <Input type={'password'} value={login.password} isDisabled={!validEmail.test(login.email)} onChangeText={(value) => signing("password", value)} size="lg" variant="outline" style={styles.bgTextInput} p={2} placeholder="Sandi" />
              {invalid.password && <Text style={{ color: 'red' }}>Minimal 8 karakter dengan angka dan huruf.</Text>}
            </Stack>
          </Stack>
          <Button style={{ width: 330, marginTop: 40 }} onPress={() => LogSubmitted.mutate()} size="lg" backgroundColor="error.600">Masuk</Button>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Text style={{ fontSize: 15 }}>New User?   </Text>
            <Link to={{ screen: "Register" }}><Text style={{ color: "orange", textDecorationLine: "underline", fontWeight: 'bold', fontSize: 15 }}>Register.</Text></Link>
          </View>
        </Square>
      </FormControl>
    </ScrollView>
  </>
)
}