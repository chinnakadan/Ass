import { useEffect, useState } from 'react';
import React from 'react';
import { ListItem } from 'react-native-elements';
import {
    View, StyleSheet, ImageBackground, BackHandler,Text, Image
} from "react-native";
import InternetBar from '../../Components/internetConnector';
import AsyncStorage from '@react-native-community/async-storage';
import { Idle } from '../../../service/api/apiservice';
import { FlatList } from 'react-native-gesture-handler';
const IdleMenu = (props) => {
    const data = [
        { "Id": "2", "Name": "Black Swan" },
        { "Id": "12", "Name": "DAPPN" },
        { "Id": "20", "Name": "demo-1" },
        { "Id": "4", "Name": "Dynamite" },
        { "Id": "5", "Name": "Fire" },
        { "Id": "7", "Name": "JK construction" },
        { "Id": "15", "Name": "lakshmi Production" },
        { "Id": "14", "Name": "Lakshmi villa" },
        { "Id": "17", "Name": "mobapp demoproduction" },
        { "Id": "10", "Name": "mobapp demoproject" },
        { "Id": "3", "Name": "Universe" },
        { "Id": "22", "Name": "wings" }
    ]
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [radd, setrAdd] = useState(0);
    const [redit, setrEdit] = useState(0);
    const [rview, setrView] = useState(0);
    const [datas , setData] = useState(data);
 

    useEffect(() => {
        retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);
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
            const response = await Idle(data);
            const datas = await response.json();
            setrAdd(datas.add);
            setrEdit(datas.edit);
            setrView(datas.view);

        } catch (error) {
            console.log(error)
        }
    }
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
 console.log(datas, 'view');
    return (<View style={styles.flatlist}>
        <View style={styles.row}>
            <InternetBar />
            <ListItem style={radd==0 ? styles.hide : styles.listItem1} onPress={() => { props.navigation.navigate('IdleEntry', { RegisterId: 0 }) }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Entry</ListItem.Title>
                </ImageBackground>
            </ListItem>
            <ListItem style={redit==1 || rview==1 ? styles.listItem2 : styles.hide} onPress={() => { props.navigation.navigate('IdleRegister') }}>
                <ImageBackground style={styles.listimg} imageStyle={{ borderRadius: 20 }} source={require('../../../assets/list4.jpg')}>
                    <ListItem.Title style={styles.list}>Register</ListItem.Title>
                </ImageBackground>
            </ListItem>
        </View>

        <FlatList
            data={datas}
            keyExtractor={item => item.Id}
            renderItem={({ item, index }) => {
                return <View >
                        <View >
                            <Image  style={{height:50, width:50}} 
                            source={{ uri:'https://i.pinimg.com/280x280_RS/a5/41/8b/a5418bb0d8c2a9b7e93f87b1f38740b7.jpg'}}></Image>
                            <Text > {item.Name}</Text>

                        </View>

                    </View>
            }
            } />


    </View>
    
    );
}
export default IdleMenu;
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