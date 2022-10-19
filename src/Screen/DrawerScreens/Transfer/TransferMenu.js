import { useEffect, useState } from 'react';
import React from 'react';
import { ListItem } from 'react-native-elements';
import {
    View, StyleSheet, ImageBackground, BackHandler
} from "react-native";
import InternetBar from '../../Components/internetConnector';
import { Transfer } from '../../../service/api/apiservice';
import AsyncStorage from '@react-native-community/async-storage';
const TransferMenu = (props) => {
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [rdadd, setrdAdd] = useState(0);
    const [rradd, setrrAdd] = useState(0);
    const [redit, setrEdit] = useState(0);
    const [rview, setrView] = useState(0);
    useEffect(() => {
        retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
    const retrieveData = async () => {
        try {
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                type: 'getrights'
            };
            const response = await Transfer(data);
            const datas = await response.json();
            setrdAdd(datas.dadd);
            setrrAdd(datas.radd);
            setrEdit(datas.edit);
            setrView(datas.view);

        } catch (error) {
            console.log(error)
        }
    }
    return (<View style={styles.flatlist}>
        <View style={styles.row}>
            <InternetBar />
            <ListItem style={rdadd==0 ? styles.hide : styles.listItem1} onPress={() => { props.navigation.navigate('TDispatchEntry',{RegisterId: 0}) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Dispatch Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={rradd==0 ? styles.hide : styles.listItem2} onPress={() => { props.navigation.navigate('TReceiptEntry',{RegisterId: 0})}}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Receipt Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={redit==1 || rview==1 ? styles.listItem2 : styles.hide} onPress={() => { props.navigation.navigate('TransferRegister') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Register</ListItem.Title>
                </ImageBackground>
            </ListItem>
        </View>
    </View>
    );
}
export default TransferMenu;
const styles = StyleSheet.create({
    row: {
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    hide: {
        display: 'none'
    },
    listimg: {
        width: '100%',
        height: 70,
        resizeMode: 'contain',
    },
    list: {
        flex: 0,
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: '5%',
    },
    flatlist: {
        fontSize: 20,
        padding: 8,
        fontWeight: 'bold',
        color: 'blue',
    },
    listItem1: {
        marginTop: '0%',
        marginLeft: '0%',
        width: '100%',
    },
    listItem2: {
        marginTop: '0%',
        width: '100%',
        marginLeft: '0%',
    },
})