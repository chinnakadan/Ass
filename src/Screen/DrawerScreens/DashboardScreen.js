import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Text, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, BackHandler, Alert, ScrollView} from "react-native";
// import Intl from 'intl';
// import "intl/locale-data/jsonp/en";
import { getDashBoardList } from '../../service/api/apiservice';
import StatusBarComponent from '../Components/statusbarcomponent';

const DashboardScreen = (props) => {
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);

    
    useEffect(() => {
        if (listItems.length == 0) retrieveData();
        const backAction = () => {
            Alert.alert("Exit App!", "Are you sure you want to exit app?", [
                {
                    text: "NO",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [ClientId, UserId]);
    const retrieveData = async () => {
        let iClientId = await AsyncStorage.getItem('clientId');
        let iUserId = await AsyncStorage.getItem('userId');
        setClientId(iClientId);
        setUserId(iUserId);
        let data = {
            ClientId: iClientId,
            UserId: iUserId,
        };

        const response = await getDashBoardList(data);
        const datas = await response.json();
        //  console.log(datas,'chinna');
        setlistItems(datas);
    };
    const navigatepage = (argId, argEntryName) => {
        if (argId == 1) {
            props.navigation.navigate('MaintenanceDashboard');
        } else if (argId == 2) {
            props.navigation.navigate('TransferMenu');
        } else if (argId == 3) {
            props.navigation.navigate('IdleMenu');
        } else if (argId == 4) {
            props.navigation.navigate('UsageMenu');
        } else if (argId == 5) {
            props.navigation.navigate('IssueMenu');
        } else if (argId == 6) {
            props.navigation.navigate('InwardMenu');
        } else if (argId == 7) {
            props.navigation.navigate('ProductionMenu');
        } else if (argId == 8) {
            props.navigation.navigate('StockMenu');
        }
    }
    return (


        <SafeAreaView style={styles.container}>
            {/* <ScrollView style={styles.scrollView}> */}
            <StatusBarComponent/>
                <View style={styles.flatlist}>
       
                    <View style={styles.row}>
                        {listItems.map((value) => (
                            <TouchableOpacity onPress={() => { navigatepage(value.id, value.ModuleName); }}
                                key={value.id}
                                style={styles.button}
                            >
                                <Image source={{ uri: value.ModuleImage }} style={styles.logo}></Image>
                                <Text
                                    style={styles.buttonLabel} >
                                    {value.ModuleName}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            {/* </ScrollView> */}
        </SafeAreaView>
    );
}
export default DashboardScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        margin: 0,
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 1,
    },
    button: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: "#FFFF",
        alignSelf: "flex-start",
        marginHorizontal: "1%",
        marginBottom: 6,
        minWidth: "40%",
        marginLeft: '6%',
        marginTop: '1%',
        alignItems: 'center',
        height: 135,
        borderWidth: 2,
       // borderColor: "#cad4e8",
        borderColor: "#fcfcfc",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 4,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "500",
       // color: "#5f7d95",
       color: "#095173",
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 90,
        height: 90,
        padding: 10,
        marginTop: 5,
    },
    flatlist: {
        justifyContent: 'center',
        flex: 1,
    },
});