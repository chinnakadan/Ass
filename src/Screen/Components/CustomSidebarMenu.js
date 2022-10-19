import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, BackHandler, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';
import Icon1 from 'react-native-elements/dist/icons/Icon';
import { getDashBoardList } from '../../service/api/apiservice';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS, SIZES, FONTS, } from '../theme/theme/'
import { FONTCOLORS } from '../theme/theme';
import RNExitApp from 'react-native-exit-app';

const CustomSidebarMenu = (props) => {
    const [randomColor, setRandomColor] = useState('');
    const [chngeColor, setchngeColor] = useState('');
    const [userName, setUserName] = useState('');
    const [Appversion, setAppversion] = useState('');
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);
    useEffect(() => {
        retrieveData();
        getcolor();
    }, []);

    useEffect(() => {
    }, [Appversion]);
    const retrieveData = async () => {
        let sUserName = await AsyncStorage.getItem('userName');
        setUserName(sUserName);
        let ver = DeviceInfo.getVersion();
        setAppversion(ver.toString());
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
        setlistItems(datas);
    }

    const getcolor = async () => {
        AsyncStorage.getItem('getcolor').then((value) => {
            value === null ? value : chngeColor
            setRandomColor(value);
        }
        )
    }
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
    const BackHandlers = () => {
        Alert.alert(
            'Exit App',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () =>  Platform.OS === "ios" ? RNExitApp.exitApp() : BackHandler.exitApp()  },
            ],
        //     { cancelable: false });
        // return true;
        )
    }
    const changeBg = async () => {
        let color = "rgb(" + Math.floor(Math.random() * 256) + "," +
            Math.floor(Math.random() * 256) + "," +
            Math.floor(Math.random() * 256) + ")";
        // let color="red";
        //let color="black";       
        setchngeColor(color);
        setRandomColor(color);
        AsyncStorage.setItem('getcolor', color);
        //let getcolor = await AsyncStorage.getItem('getcolor');
        //console.log(getcolor);
        //setgetColor(getcolor);
        console.log(color, 'dda');
    }
    return (
        <View style={stylesSidebar.sideMenuContainer}>
            {/* <View style={{ marginLeft: '5%', height: 60, width: '90%',marginTop:15,}}>
                <Image
                    source={{ uri: 'asset:/images/bsflogo.png' }}
                    style={{ height: 60, marginLeft: '2%', }}
                />
            </View> */}

            <View style={stylesSidebar.profileHeaderLine} ><Text style={stylesSidebar.textStyle}>{Appversion}</Text></View>
            <View style={[stylesSidebar.profileHeader, { backgroundColor: randomColor }]}>
                <View style={stylesSidebar.profileHeaderPicCircle}>
                    <Text style={{ fontSize: 25, color: FONTCOLORS.primary, }}>
                        {userName.charAt(0)}
                    </Text>
                </View>
                <Text style={stylesSidebar.profileHeaderText}>
                    {userName}
                </Text>
            </View>
            <View style={stylesSidebar.profileHeaderLine} />

            {listItems.map((value) => (
                <TouchableOpacity onPress={() => { navigatepage(value.id, value.ModuleName); }}
                    key={value.id}
                    style={stylesSidebar.LogoutHeader}
                >
                    <Text style={{ color: 'black', fontSize: 18, marginLeft: 15, paddingVertical: 5, width: '70%' }}>
                        {value.ModuleName}
                    </Text>
                    <Icon2 name="chevron-right" type="ionicon" color={COLORS.primary} size={25} style={{ marginTop: 7, }} />
                </TouchableOpacity>
            ))}

            <DrawerContentScrollView {...props}>
                {/* <DrawerItemList {...props} /> */}
                <DrawerItem
                    label={({ color }) =>
                        <TouchableOpacity onPress={BackHandlers} style={stylesSidebar.LogoutHeader1}>
                            <View style={stylesSidebar.LogoutHeader1}>
                                <Icon1 name="log-in" type="ionicon" color="red" size={25} />
                                <Text style={{ color: 'red', fontSize: 20, marginLeft: 10, width: '70%' }}>
                                    Logout
                                </Text>
                            </View>

                        </TouchableOpacity>
                    }
                />
            </DrawerContentScrollView>

            {/* <View style={stylesSidebar.container}>
                <Text style={[stylesSidebar.profileHeaderText, { color: randomColor }]}>
                    Appearance</Text>
                <View style={[stylesSidebar.colorchoosecircle, { backgroundColor: randomColor }]}>
                    <TouchableOpacity onPress={changeBg}>
                        <Icon2 name="check" type="ionicon" color="#fff" size={25} style={{ marginTop: 7, }} />
                    </TouchableOpacity>
                </View>
            </View> */}

            <View style={{ marginLeft: '5%', height: 60, width: 273, marginTop: 15, }}>
                <Image
                source={require('../../assets/bsflogo.png')}
                style={{ height: 60, marginLeft: '10',  width: 250}}
                />
            </View>
            <View style={stylesSidebar.AppverHeader}>
                <Text style={stylesSidebar.AppHeader}>
                    App version  {Appversion}
                </Text>
            </View>
        </View>
    );
};

export default CustomSidebarMenu;

const stylesSidebar = StyleSheet.create({
    sideMenuContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 0,
        color: 'white',
    },
    profileHeader: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        padding: 15,
        textAlign: 'center',
    },
    AppverHeader: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        padding: 15,
        textAlign: 'center',
    },
    LogoutHeader: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        textAlign: 'center',
        width: '100%',
        marginTop: '1%',
        marginBottom: '1%',
        paddingLeft: 20,
    },
    LogoutHeader1: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        textAlign: 'center',
        width: '100%',
        marginTop: '1%',
        marginBottom: '1%',
        paddingLeft: 5,
    },
    AppHeader: {
        color: 'black',
        alignSelf: 'center',
        paddingHorizontal: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: '25%',
    },
    profileHeaderPicCircle: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        color: 'white',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeaderText: {
        color: 'white',
        alignSelf: 'center',
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 20,
    },
    profileHeaderLine: {
        height: 1,
        marginHorizontal: 20,
        backgroundColor: '#e2e2e2',
        marginTop: 15,
    },
    logo: {
        width: 100,
        height: 50,

    },
    viewlogo: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
        marginTop: '10%',
    },
    textStyle:
    {
        color: 'black',
    }
    , colorchoosecircle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        color: 'white',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 10,
        fontStyle: 'italic',
        backgroundColor: '#6A1B4D',
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#eee',
        textTransform: 'uppercase',
        borderRadius: 15,
        marginTop: 10
    }
});