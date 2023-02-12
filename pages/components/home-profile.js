import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, FormControl, HStack, Input, Modal, View, Actionsheet } from "native-base";
import { useState, useEffect } from "react";
import { ImageBackground, Text, TouchableOpacity } from "react-native";
import { useQuery } from "react-query";
import { API } from "../../config/api";

export default function Profile(props) {
    const [setting, handleSet] = useState(false)
    const [modal, setModal] = useState([false, ''])
    const [amount, setAmount] = useState('')
    const closeModal = () => {
        setModal([false, '']);
        setAmount('')
    }

    const { data: profile, refetch: update } = useQuery('Profile', async () => {
        const response = await API.get('/getProfile');
        return response.data.data;
    });

    const { data: balance, refetch } = useQuery('Balance', async () => {
        const response = await API.get('/balance');
        return response.data.data;
    });

    const postBalance = async () => {
        try {
            let numberAmount = Number(amount.replace(/[^0-9]/g, ''))
            if (numberAmount < 10000) {
                alert("Minimal transaksi Rp10.000!")
                closeModal()
                return
            }
            let input = { amount: numberAmount }
            await API.post(`/${modal[1].toLowerCase()}`, input);
            alert(`${modal[1]} sukses!`)
            closeModal()
        } catch (error) {
            alert(error.response.data.message + "!")
        }
    };

    useEffect(() => {
        refetch()
    })

    const [modalProfile, setProfile] = useState(false);

    const [data, setData] = useState({
        first_name: "",
        last_name: ""
    })

    const posting = (key, value) => {
        setData({
            ...data,
            [key]: value,
        });
    }

    const postUpdate = async () => {
        try {
            await API.post(`/updateProfile`, data);
            alert('Pembaharuan berhasil!')
            update()
            setProfile(false)
        } catch (error) {
            alert(error.response.data.message + "!")
        }
    };

    return (
        <>
            <View>
                <ImageBackground
                    source={require('../../assets/Header.png')}
                    style={{
                        width: '100%',
                        height: 220,
                        justifyContent: 'center',
                    }}>

                    <View style={{ width: '100%', height: '100%', padding: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: '800', marginBottom: 10 }}>Hai, {profile?.first_name}</Text>
                            <HStack>
                                <Text style={{ fontSize: 30, fontWeight: '800', marginEnd: 5 }}>Rp{balance?.balance === null ? '0' : balance?.balance}</Text>
                                <Ionicons name="sync-circle" size={30} color={'#FFEFD5'} onPress={async () => refetch()} />
                            </HStack>
                        </View>
                        <Ionicons name="settings-sharp" size={30} onPress={() => handleSet(true)} />
                    </View>
                </ImageBackground>

                <View style={{ width: '100%', height: 170, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: -60 }}>
                    <TouchableOpacity style={{ width: '35%', height: '75%' }} onPress={() => setModal([true, 'Topup'])}>
                        <View style={{ height: 130, backgroundColor: '#ef4824', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="wallet-sharp" color={'#FFEFD5'} size={70} />
                            <Text style={{ color: '#FFEFD5', fontWeight: 'bold' }}>Top-Up Saldo</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '35%', height: '75%' }} onPress={() => setModal([true, 'Transfer'])}>
                        <View style={{ height: 130, backgroundColor: '#ef4824', borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="log-out-sharp" color={'#FFEFD5'} size={70} />
                            <Text style={{ color: '#FFEFD5', fontWeight: 'bold' }}>Transfer</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal isOpen={modal[0]} onClose={() => closeModal()} avoidKeyboard>
                <Modal.Content maxWidth="400px">
                    <Modal.Header style={{ backgroundColor: '#ef4824' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{modal[1]} Saldo</Text>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Nilai {modal[1]}</FormControl.Label>
                            <Input value={amount} textAlign={'right'} size={'xl'} variant={'rounded'} onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "."))} />
                        </FormControl>

                        <Button.Group colorScheme='amber' style={{ flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 10 }}>
                            <Button variant={"subtle"} onPress={() => { setAmount('10.000') }}>
                                10.000
                            </Button>
                            <Button variant={"subtle"} onPress={() => { setAmount('25.000') }}>
                                25.000
                            </Button>
                            <Button variant={"subtle"} onPress={() => { setAmount('50.000') }}>
                                50.000
                            </Button>
                        </Button.Group>
                        <Button.Group colorScheme='amber' style={{ flexWrap: 'wrap', justifyContent: 'space-around' }}>
                            <Button variant={"subtle"} onPress={() => { setAmount('100.000') }}>
                                100.000
                            </Button>
                            <Button variant={"subtle"} onPress={() => { setAmount('500.000') }}>
                                500.000
                            </Button>
                        </Button.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                closeModal()
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                postBalance()
                            }}>
                                {modal[1]}
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            <Actionsheet isOpen={setting} onClose={() => handleSet(false)}>
                <Actionsheet.Content>
                    <Actionsheet.Item onPress={() => setProfile(true)}>Sunting Profil</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => props.Logout()}>Keluar</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>

            <Modal isOpen={modalProfile} onClose={() => setProfile(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>Sunting Akun</Modal.Header>
                    <Modal.Body>
                        <FormControl>
                            <FormControl.Label>Nama Depan</FormControl.Label>
                            <Input value={data.first_name} onChangeText={value => posting("first_name", value)} />
                        </FormControl>
                        <FormControl mt="3">
                            <FormControl.Label>Nama Belakang</FormControl.Label>
                            <Input value={data.last_name} onChangeText={value => posting("last_name", value)} />
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setProfile(false)
                            }}>
                                Batal
                            </Button>
                            <Button onPress={() => {
                                postUpdate()
                            }}>
                                Simpan
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    )
}