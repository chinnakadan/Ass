import { useState, useEffect } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, TouchableOpacity, Alert, Modal, Button, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Stock } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
const AssetCCGStock = (props) => {
    const { AssetId, AssetName, RepType } = props.route.params;
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);
    const [listItemsasset, setlistItemsasset] = useState([]);
    const [Data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchvisible, setsearchvisible] = useState(false);
    const [repName, setRepName] = useState('');
    useEffect(() => {
        if (Data.length == 0) retrieveData();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    useEffect(() => {
        if (RepType == 3) setRepName('Issue');
        else if (RepType == 2) setRepName('Idle');
        else setRepName('Stock');
    }, [RepType]);
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
    const retrieveData = async () => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                AssetId: AssetId,
                RepType: RepType,
                type: 'getCCAssetStock'
            };
            const response = await Stock(data);
            const datas = await response.json();
            setData(datas);
            setlistItems(datas);
            if (datas.length > 10) setsearchvisible(true);
            else setsearchvisible(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    function handleChange() {
        setModalVisible(false)
    }
    function showFollowup(item) {
        props.navigation.push('MFollowup', { ShTransId: item.ShTransId, TicketId: 0 });
    }
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.CostCentreName
                            ? item.CostCentreName.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setData(newData);
                setSearch(query);
            } else {
                setData(listItems);
                setSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Loader loading={loading} />
            {/* <ScrollView> */}
                <View style={styles.container}>
                    <View style={styles.row}>
                        <View style={styles.searchview}>
                            <View>
                                <Text style={styles.assetname}>{AssetName}</Text>
                            </View>
                            <Searchbar style={searchvisible == true ? styles.modalView : styles.hide}
                                placeholder="Search"
                                onChangeText={onChangeSearch}
                                value={search}
                            />
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.costcenterlbl} >CostCentre Name</Text>
                                </View>
                                <View style={styles.col3}>
                                    <Text style={styles.stocklbl} >{repName}</Text>
                                </View>
                            </View>
                            <FlatList style={styles.flatlist}
                                data={Data}
                                keyExtractor={item => item.CostCentreId}
                                // ListHeaderComponent={() => <Text>CostCentre Name</Text>}
                                renderItem={({ item, index }) => {
                                    return <View  ><TouchableOpacity style={styles.touch}>
                                        <View style={styles.Flatlistview}>
                                            <View style={styles.col7}>
                                                <Text style={styles.costcentername} >{item.CostCentreName}</Text>
                                            </View>
                                            {/* <Text style={styles.colon}>: </Text> */}
                                            <View style={styles.col3}>
                                                <Text style={styles.stock}>{CommonFun.numberDigit(parseFloat(item.Stock), 3)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    </View>
                                }}
                            />
                            {/* <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemtittle} >Total</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col3}>
                                    <Text style={styles.itemTitle1}>125252</Text>
                                </View>
                            </View> */}
                        </View>
                    </View>
                    <View>
                        <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                    </View>
                </View>
            {/* </ScrollView> */}
        </>
    );
}
export default AssetCCGStock;
const styles = StyleSheet.create({
    row: {
        marginTop: 5,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    centeredViewrow: {
        width: '94%',
        marginHorizontal: '3%',

    },
    hide: {
        display: 'none'
    },
    modalView: {
        top: 7,
        backgroundColor: "transparent",
        borderRadius: 2,
        padding: 1,
        width: '50%',
        marginLeft: '50%',
        height: 40,
        shadowColor: "#ffff",
        // marginBottom: 5,
    },
    button: {

        padding: 10,
        // elevation: 2,
        backgroundColor: 'transparent',
        borderColor: COLORS.brdleftblue,
        borderWidth: 2,
        paddingVertical: 16,
    },
    searchview: {
        // flex: 0,
        // marginTop: 22,
    },
    modeltouch: {
        backgroundColor: 'white',
        marginTop: '40%',
        margin: '2%',
        marginBottom: 10,
        padding: 10,
        justifyContent: 'flex-start',
        borderLeftWidth: 2,
        borderLeftColor: COLORS.brdleftblue,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: '#cad4e8',
        borderRightColor: '#cad4e8',
        borderBottomColor: '#cad4e8',
        fontSize: 24,
        fontWeight: 'bold',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 1,
        marginBottom: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 2,
        borderLeftColor: COLORS.brdleftblue,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#cad4e8',
        borderRightColor: '#cad4e8',
        borderBottomColor: '#cad4e8',
        fontSize: 24,
        fontWeight: 'bold',
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    itemTitle: {
        color: 'black',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    flatlist: {
        fontSize: 20,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        color: 'blue',
    },
    itemTitle1: {
        flex: 0,
        color: 'black',
        // height: 30,
        fontWeight: 'bold',
        paddingLeft: 5,
        marginRight: 3,
        textAlign: 'right'
    },
    duedate: {
        flex: 0,
        color: 'black',
        fontWeight: 'bold',
        paddingLeft: 5,
    },
    itemTitle3: {
        color: 'red',
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    Flatlistview:
    {
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,

    },

    textStyle:
    {
        color: 'black',
        // textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 15,

    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginRight: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        borderRadius: 5,
    },
    btnIcon: {
        marginTop: 4, height: 20, width: 20,
    },
    previewmodaltext:
        { color: 'black', height: 30, fontWeight: 'bold', fontSize: 18, },

    closeText:
    {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 40,
        paddingRight: 40,
        fontSize: 18,
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20
    },
    itemtittle:
    {
        color: 'black',
        textAlign: 'left',
        padding: 2,
        fontSize: 15

    },
    col3: {
        width: '29%',
    },
    col7: {
        width: '71%',

    },
    colon:
    {
        paddingTop: 10,
    },
    labeltxt:
    {
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 24,
    },
    costcentername: {
        color: '#088548',
        paddingRight: 3,
        paddingTop: 4,
        fontWeight: 'bold',
    },
    stock: {
        color: '#ED0054',
        paddingRight: 3,
        paddingTop: 4,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    assetname: {
        textAlign: 'center', // <-- the magic
        fontSize: 18,
        marginVertical: 5,
        width: '94%',
        marginHorizontal: '3%',
        color: '#0875d4',
        marginLeft: 10,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        paddingVertical: 10,
    },
    costcenterlbl: {
        textAlign: 'left', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        paddingHorizontal: 18,
    },
    stocklbl: {
        textAlign: 'center', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        paddingHorizontal: 25,
    },
    border:
    {
        borderWidth: 1,
    }
})