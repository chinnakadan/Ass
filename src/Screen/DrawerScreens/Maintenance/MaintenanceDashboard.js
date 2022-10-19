import { useState, useEffect } from 'react';
import React from 'react';
import { ListItem } from 'react-native-elements';
import { View, StyleSheet, ImageBackground, BackHandler } from "react-native";
import InternetBar from '../../Components/internetConnector';
import AsyncStorage from '@react-native-community/async-storage';
import { Maintentance } from '../../../service/api/apiservice';
const MaintenanceDashboard = (props) => {
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [rfadd, setrfAdd] = useState(0);
    const [rtadd, setrtAdd] = useState(0);
    const [rfview, setrfView] = useState(0);
    const [rtview, setrtView] = useState(0);
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
            const response = await Maintentance(data);
            const datas = await response.json();
            setrfAdd(datas.fadd);
            setrtAdd(datas.tadd);
            setrfView(datas.fview);
            setrtView(datas.tview);

        } catch (error) {
            console.log(error)
        }
    }
    return (<View style={styles.flatlist}>
        <View style={styles.row}>
            <InternetBar />
            <ListItem style={rfadd==1 || rfview==1 ? styles.listItem2 : styles.hide} onPress={() => { props.navigation.navigate('Amc') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>AMC / Insurance / Warranty</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={rfadd==1 || rfview==1 ? styles.listItem1 : styles.hide} onPress={() => { props.navigation.navigate('MaintenanceNotification') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Preventive (Planned)</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={rtadd==1 || rtview==1 || rfadd==1 ? styles.listItem2 : styles.hide } onPress={() => { props.navigation.navigate('TicketView') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Repairs (Ticket)</ListItem.Title>
                </ImageBackground>
            </ListItem>
        </View>
    </View>
    );
}
export default MaintenanceDashboard;
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
        // marginRight: 50,
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