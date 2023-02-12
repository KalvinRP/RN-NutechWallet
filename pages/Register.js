import { Link } from "@react-navigation/native";
import { Button, Center, FormControl, Image, Input, Square, Stack } from "native-base";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { styles } from "../Stylesheet";
import { useMutation } from "react-query";
import { API } from "../config/api";

export default function Register({ navigation }) {
  const validEmail = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
  const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/
  const [invalid, setInvalid] = useState({
    email: false,
    password: false
  })
  
  const [data, setData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  })

  const posting = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  }

  const RegSubmitted = useMutation(async (e) => {
    try {
      if (validEmail.test(data.email) && validPassword.test(data.password)) {
        setInvalid({
          email: false,
          password: false
        })
        const response = await API.post('/registration', data);
        if (response.data.status === 0) {
          alert(response.data.message);
          navigation.navigate("Login");
        }
      } else {
        if (!validEmail.test(login.email)) { setInvalid({ email: true }) }
        if (!validPassword.test(login.password)) { setInvalid({ password: true }) }
        if (!validEmail.test(login.email) && !validPassword.test(login.password)) { setInvalid({ email: true, password: true }) }
      }
    } catch (error) {
      console.log(error)
      // if (error.response.data.status === 102) {
      //   alert(error.response.data.message + '!')
      // }
    }
  });

  return (
    <ScrollView style={styles.bgColor}>
      <KeyboardAvoidingView
        behavior="position">
        <Center>
          <Image source={require('../assets/splash.png')} alt="loading" style={styles.entranceImage} />
        </Center>
        <Text style={styles.entranceTitle}>Register</Text>
        <FormControl>
          <Square>
            <Stack space={5} w="85%" mt={30}>
              <Stack>
                <Input type={'text'} value={data.email} onChangeText={(value) => posting("email", value)} form size="lg" variant="outline" bg={styles.bgTextInput} p={2} placeholder="Surel" />
                {invalid.email && <Text style={{ color: 'red' }}>Surel tidak berlaku. Harap periksa kembali.</Text>}
              </Stack>
              <Stack>
                <Input type={'text'} value={data.first_name} onChangeText={(value) => posting("first_name", value)} size="lg" variant="outline" bg={styles.bgTextInput} p={2} placeholder="Nama Depan" />
              </Stack>
              <Stack>
                <Input type={'text'} value={data.last_name} onChangeText={(value) => posting("last_name", value)} size="lg" variant="outline" bg={styles.bgTextInput} p={2} placeholder="Nama Belakang" />
              </Stack>
              <Stack>
                <Input type={'password'} value={data.password} onChangeText={(value) => posting("password", value)} size="lg" variant="outline" bg={styles.bgTextInput} p={2} placeholder="Sandi" />
                {invalid.password && <Text style={{ color: 'red' }}>Minimal 8 karakter dengan angka dan huruf.</Text>}
              </Stack>
            </Stack>
            {/* <Button style={{ width: 330, marginTop: 40 }} onPress={() => RegSubmitted.mutate()} size="lg" backgroundColor="error.600">Register</Button> */}
            <Button style={{ width: 330, marginTop: 40 }} onPress={() => RegSubmitted.mutate()} size="lg" backgroundColor="error.600">Register</Button>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Text style={{ fontSize: 15 }}>Joined us before?   </Text>
              <Link to={{ screen: "Login" }}><Text style={{ color: "orange", textDecorationLine: "underline", fontWeight: 'bold', fontSize: 15 }}>Login.</Text></Link>
            </View>
          </Square>
        </FormControl>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}