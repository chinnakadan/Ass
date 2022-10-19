import { useState, useEffect } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, TouchableOpacity, Alert, Modal, Button, BackHandler, Switch, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Stock } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import { Picker } from '@react-native-picker/picker';
import SPickList from '../../Components/sPickList';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import  RNPickerSelect from 'react-native-picker-select';

const AssetStock = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [listItems, setlistItems] = useState([]);
    const [listItemsasset, setlistItemsasset] = useState([]);
    const [Data, setData] = useState([]);
    const [dataasset, setdataasset] = useState([]);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchasset, setSearchasset] = useState('');
    const [Preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [AssetName, setAssetName] = useState('');
    const [AssetId, setAssetId] = useState('0');
    const [searchvisible, setsearchvisible] = useState(false);
    const [selectvisible, setselectvisible] = useState(false);
    const [repType, setRepType] = useState('1');
    const [repName, setRepName] = useState('Stock');
    const [switchValue, setSwitchValue] = useState(true);
    useEffect(() => {
        if (dataasset.length == 0) retrieveData();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    useEffect(() => {
        if (repType == 3) setRepName('Issue');
        else if (repType == 2) setRepName('Idle');
        else setRepName('Stock');
    }, [repType]);
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
                type: 'getassetList'
            };
            const response = await Stock(data);
            const datas = await response.json();
            setdataasset(datas);
            setlistItemsasset(datas);
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
    const actionOnRowAsset = async (item) => {
        setAssetName(item.Name);
        setModalVisible(false);
        var iAssetId = item.Id;
        setAssetId(iAssetId);
        loadData(iAssetId, repType);
        setLoading(false);
    }
    function changeRepType(argRepType) {
        setRepType(argRepType);
        loadData(AssetId, argRepType);
    }
    const loadData = async (argAssetId, argRepType) => {
        setLoading(true);
        if (argAssetId > 0) setselectvisible(true);
        else setselectvisible(false);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            AssetId: argAssetId,
            RepType: argRepType,
            type: 'getCCAssetStock'

        };
        const response = await Stock(data)
        var dataa = await response.json();
        setlistItems(dataa);
        setData(dataa);
        if (dataa.length > 10) setsearchvisible(true);
        else setsearchvisible(false);
        setLoading(false);
    }
    const onChangeSearchAsset = (query) => {
        try {
            if (query) {
                const newData = listItemsasset.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setdataasset(newData);
                setSearchasset(query);
            } else {
                setdataasset(listItemsasset);
                setSearchasset(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.AssetName
                            ? item.AssetName.toUpperCase()
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
            <View style={styles.container}>
                <View style={[styles.Flatlistview2, { height: 25 }]}>
                    <View style={styles.col60}>
                    </View>
                    <View style={[styles.col15]}>
                        <Text style={{ textAlign: 'right', color: FONTCOLORS.primary, fontWeight: 'bold', marginTop: 4, }}>
                            {switchValue ? 'Filter on' : 'Filter off'}
                        </Text>
                    </View>
                    <View style={[styles.col20, { marginRight: 15 }]}>
                        <Switch
                            style={{ marginTop: 0 }}
                            onValueChange={(itemValue) => setSwitchValue(itemValue)}
                            value={switchValue}
                        />
                    </View>
                </View>
                <View style={switchValue == true ? '' : styles.hide}>
                    <View style={styles.mtxttop}>
                        <Text style={styles.assetname}>Asset Name</Text>
                        <View style={styles.centeredViewrow}>
                            <SPickList visible={modalVisible} data={dataasset} onChange={handleChange} onChangeSearch={onChangeSearchAsset} search={searchasset} actionOnCancel={setModalVisible} actionOnRow={actionOnRowAsset} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{AssetName ? AssetName : 'Select Asset'}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.mtxttop}>
                        <View style={{ width: '95%', marginLeft: '2.5%', marginRight: '2.5%', }}>
                            <View style={styles.pickerView}>
                                <Text style={styles.labeltxt}>Report Type</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%" , height:50, paddingTop:15, paddingLeft:10}}>
                                    {Platform.OS == 'android' ?
                                        <Picker
                                            selectedValue={repType}
                                            style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                            onValueChange={(itemValue, itemIndex) => changeRepType(itemValue)}
                                        >
                                            <Picker.Item label="Stock" value="1" />
                                            <Picker.Item label="Idle" value="2" />
                                            <Picker.Item label="Issue" value="3" />
                                        </Picker>
                                        : 
                                        <RNPickerSelect
                                            selectedValue={repType}
                                            style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                            items={[
                                                { label: "Stock", value: "1" },
                                                { label: "Idle", value:  "2" },
                                                { label: "Issue", value: "3" }
                                            ]}
                                            onValueChange={(itemValue, itemIndex) => changeRepType(itemValue)}>

                                            </RNPickerSelect>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <Searchbar style={searchvisible == true ? styles.modalView : styles.hide}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={search}
                />
                <View style={selectvisible == true ? styles.Flatlistview1 : styles.hide} >
                    <View style={styles.col7}>
                        <Text style={styles.costcenterlbl} >CostCentreName</Text>
                    </View>
                    <View style={styles.col3}>
                        <Text style={styles.stocklbl} >{repName}</Text>
                    </View>
                </View>
                <View style={selectvisible == true ? '' : styles.hide}>
                {/* ios not support for scrollview then i will change to the condition on view tag */}
                {/* <ScrollView > */}
                    <FlatList style={styles.flatlist}
                        data={Data}
                        keyExtractor={item => item.CostCentreId}
                        // ListHeaderComponent={() => <Text>CostCentre Name</Text>}
                        renderItem={({ item, index }) => {
                            return <View>

                                <TouchableOpacity style={styles.touch}>
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

                    <View>
                        <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                    </View>
                {/* </ScrollView> */}
                </View>


            </View>



        </>
    );
}
export default AssetStock;
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
    },
    button: {
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        paddingVertical: 16,
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 0,
        marginBottom: 0,
        paddingHorizontal: 5,
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
    Flatlistview:
    {
        marginHorizontal: 6,
        marginVertical: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
    },
    Flatlistview1:
    {
        marginHorizontal: 6,
        marginVertical: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '93%',
        marginHorizontal: '4%',
    },
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginTop: 0,
    },
    col20: {
        width: '13%',
    },
    col15: {
        width: '15%',
    },
    col60: {
        width: '70%',
    },
    textStyle:
    {
        color: 'black',
        // textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 15,

    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        // padding: 10,
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
        paddingTop: 5,
    },
    labeltxt:
    {
        fontWeight: 'bold',
        color: FONTCOLORS.primary,
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
        textAlign: 'left', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: '#022969',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    costcenterlbl: {
        textAlign: 'left', // <-- the magic
        fontSize: 15,
        marginTop: 0,
        width: '100%',
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    stocklbl: {
        textAlign: 'center', // <-- the magic
        fontSize: 15,
        marginTop: 0,
        width: '100%',
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        paddingHorizontal: 25,
    },
})