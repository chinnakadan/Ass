import { useEffect, useState } from 'react';
import React from 'react';
import { ListItem } from 'react-native-elements';
import {
    View, StyleSheet, ImageBackground, BackHandler
} from "react-native";
import InternetBar from '../../Components/internetConnector';
import { Make } from '../../../service/api/apiservice';
import AsyncStorage from '@react-native-community/async-storage';
const ProductionMenu = (props) => {
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [madd, setmAdd] = useState(0);
    const [dadd, setdAdd] = useState(0);
    const [radd, setrAdd] = useState(0);
    const [medit, setmEdit] = useState(0);
    const [pedit, setpEdit] = useState(0);
    const [mview, setmView] = useState(0);
    const [pview, setpView] = useState(0);
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
            const response = await Make(data);
            const datas = await response.json();
            setmAdd(datas.madd);
            setdAdd(datas.dadd);
            setrAdd(datas.radd);
            setmEdit(datas.medit);
            setpEdit(datas.pedit);
            setmView(datas.mview);
            setpView(datas.pview);
        } catch (error) {
            console.log(error)
        }
    }
    return (<View style={styles.flatlist}>
        <View style={styles.row}>
            <InternetBar />
            <ListItem style={madd==0 ? styles.hide : styles.listItem1} onPress={() => { props.navigation.navigate('MakeEntry',{RegisterId: 0}) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Make Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={madd==0 ? styles.hide : styles.listItem1} onPress={() => { props.navigation.navigate('MakeTransfer',{RegisterId: 0}) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Make and Transfer</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={medit ==1|| mview==1 ? styles.listItem2 : styles.hide} onPress={() => { props.navigation.navigate('MakeRegister') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Make Register</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={dadd==0 ? styles.hide : styles.listItem1} onPress={() => { props.navigation.navigate('PDispatchEntry',{RegisterId: 0}) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Dispatch Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={radd==0 ? styles.hide : styles.listItem2} onPress={() => { props.navigation.navigate('PReceiptEntry',{RegisterId: 0}) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Receipt Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={pedit ==1|| pview==1 ? styles.listItem2 : styles.hide} onPress={() => { props.navigation.navigate('ProductionRegister') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Production Register</ListItem.Title>
                </ImageBackground>
            </ListItem>
        </View>
    </View>
    );
}
export default ProductionMenu;
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
        height: 65,
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