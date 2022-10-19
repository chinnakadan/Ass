import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Label, { Orientation } from "react-native-label";
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import { parse } from '@babel/core';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const MaintenanceTicket = (props) => {
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [listItems, setlistItems] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [listItemsasset, setlistItemsasset] = useState([]);
    const [dataasset, setDataasset] = useState([]);
    const [searchasset, setSearchasset] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleAsset, setModalVisibleAsset] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [qty, setQty] = React.useState("1");
    const [stock, setStock] = React.useState("0");
    const [maintenanceType, setMaintenanceType] = useState("1");
    const [priority, setPriority] = useState('N');
    const [idle, setIdle] = useState('0');
    const pickerRef = useRef();
    const [CmpName, setCpmName] = useState('');
    const [AssetName, setAssetName] = useState('');
    const [CostcentreId, setCostcentreId] = useState('0');
    const [AssetId, setAssetId] = useState('0');
    const [BulkAsset, setBulkAsset] = useState('0');
    const [submitClick, setsubmitClick] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (data.length == 0) retrieveData();
        const backAction = () => {
            Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                {
                    text: "NO",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: 'YES', onPress: () => props.navigation.goBack() },
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
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                type: "getdata",
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            setlistItems(datas.CostCentreList);
            setData(datas.CostCentreList);
            getCurrentLocation();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }
    const getCurrentLocation = async () => {
        Geocoder.init('AIzaSyDaNPyxJ7NKmZ4rC8awB-BlBh6ieH1Q9os');
        Geolocation.getCurrentPosition(position =>
            Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
                setgLocation(json.results[0].formatted_address);
                setgLatitude(position.coords.latitude);
                setgLongitude(position.coords.longitude);
            })
        )
    }

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }
    const onChangeSearch = (query) => {
        try {
            if (query) {
                const newData = listItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
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
                setDataasset(newData);
                setSearchasset(query);
            } else {
                setDataasset(listItems);
                setSearchasset(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const actionOnRow = async (item) => {
        setCpmName(item.Name);
        setModalVisible(false);
        var iCostcentreId = item.Id;
        setCostcentreId(iCostcentreId);
        let getAssetList = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getAssetList'

        };
        const response = await Maintentance(getAssetList);
        var dataa = await response.json();
        setlistItemsasset(dataa);
        setDataasset(dataa);
    }
    const actionOnRowAsset = (item) => {
        setAssetName(item.Name);
        setModalVisibleAsset(false);
        setAssetId(item.Id);
        if (item.TrackType == 'B') setBulkAsset(1);
        else setBulkAsset(0);
        console.log(item);
        setStock(item.Qty);
    }
    function handleChange() {
        // Here, we invoke the callback with the new value
        setModalVisible(false)
    }
    function handleChangeAsset() {
        // Here, we invoke the callback with the new value
        setModalVisibleAsset(false)
    }
    function checkQty(argValue) {
        let dQty = argValue;
        if (CommonFun.FloatVal(dQty) > CommonFun.FloatVal(stock)) {
            alert("Qty greater than Stock Qty");
            dQty = 0;
        }
        setQty(dQty);
    }
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (CostcentreId == 0) {
            setsubmitClick(false);
            alert("Select Costcentre");
            return;
        }
        if (AssetId == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        setLoading(true);
        updateData();
    }
    const updateData = async () => {
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                CostcentreId: CostcentreId,
                AssetId: AssetId,
                MaintenanceType: maintenanceType,
                Priority: priority,
                Idle: idle,
                Remarks: remarks,
                Qty: 1,
                BulkAsset: BulkAsset,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "update",
            };
            const response = await Maintentance(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.push('TicketView');
            } else {
                alert(datas.Status);
                setLoading(false);
                setsubmitClick(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
            setsubmitClick(false);
        }
    }
    return (
        <>
            <Loader loading={loading} />
            <View style={styles.mtop}>
                {/* <ScrollView> */}
                    {/* <Picker
                    ref={pickerRef}
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker> */}
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>CostCentre Name</Text>
                        <View style={styles.centeredView}>
                            <SPickList visible={modalVisible} data={data} onChange={handleChange} onChangeSearch={onChangeSearch} search={search} actionOnCancel={setModalVisible} actionOnRow={actionOnRow} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{CmpName ? CmpName : 'Select CostCentre'}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>Asset Name</Text>
                        <View style={styles.centeredView}>
                            <SPickList visible={modalVisibleAsset} data={dataasset} onChange={handleChangeAsset} onChangeSearch={onChangeSearchAsset} search={searchasset} actionOnCancel={setModalVisibleAsset} actionOnRow={actionOnRowAsset} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisibleAsset(true)}
                            >
                                <Text style={styles.textStyle}>{AssetName ? AssetName : 'Select Asset'}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.row1.mtxttop}>
                        <View style={styles.Flatlistview}>
                            <View style={BulkAsset == 1 ? styles.inputContainer2 : styles.inputContainer}>
                                <View style={styles.inputContainer.pickerView}>
                                    <Text style={styles.labeltxt}>Maintenance Type</Text>
                                    <View style={{ borderWidth: 1, height:50,borderColor: COLORS.brdleftblue, width: "100%",paddingTop:15,paddingLeft:10 }}>
                                        {
                                            Platform.OS == 'ios' ?

                                                <RNPickerSelect
                                                    selectedValue={maintenanceType}
                                                    placeholderTextColor="#ccc"
                                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                                    items={[
                                                        { label: 'Maintenance', value: '1' },
                                                        { label: 'Inspection', value: '2' },
                                                        { label: 'Not working', value: '3' },
                                                    ]}
                                                    onValueChange={(itemValue, itemIndex) => setMaintenanceType(itemValue)}>
                                                </RNPickerSelect>
                                                :
                                                <Picker
                                                    selectedValue={maintenanceType}
                                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                                    onValueChange={(itemValue, itemIndex) => setMaintenanceType(itemValue)}
                                                >
                                                    <Picker.Item label="Maintenance" value="1" />
                                                    <Picker.Item label="Inspection" value="2" />
                                                    <Picker.Item label="Not working" value="3" />
                                                </Picker>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={BulkAsset == 1 ? styles.inputContainer2 : styles.inputContainerhide2}>
                                <Text style={[styles.labeltxt, { textAlign: 'center' }]}>Qty</Text>
                                <TextInput
                                    style={[styles.input, { textAlign: 'center' }]}
                                    value={qty? qty.toString() : ''}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    onChangeText={text => checkQty(text)}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.row1.mtxttop}>
                        <View style={styles.Flatlistview}>
                            <View style={priority == 'C' ? styles.inputContainer2 : styles.inputContainer}>
                                <View style={styles.inputContainer.pickerView}>
                                    <Text style={styles.labeltxt}>Priority</Text>
                                    <View style={{ borderWidth: 1,height:50, borderColor: COLORS.brdleftblue, width: "100%",paddingTop:15,paddingLeft:10   }}>
                                    {
                                            Platform.OS == 'ios' ?

                                                <RNPickerSelect
                                                    selectedValue={priority}
                                                    style={{ height: 50, width: '100%' }}
                                                    placeholderTextColor="#ccc"
                                                    items={[
                                                        { label: 'Non-Critical', value: 'N' },
                                                        { label: 'Critical', value: 'C' },
                                                    ]}
                                                    onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}>
                                                </RNPickerSelect>
                                                :
                                        <Picker
                                            selectedValue={priority}
                                            style={{ height: 50, width: '100%' }}
                                            onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
                                        >
                                            <Picker.Item label="Non-Critical" value="N" />
                                            <Picker.Item label="Critical" value="C" />
                                        </Picker>
}
                                    </View>
                                </View>
                            </View>
                            <View style={priority == 'C' ? styles.inputContainer2 : styles.inputContainerhide2}>
                                <Text style={styles.labeltxt}>Does it goes to Idle?</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%",height:50,paddingTop:15,paddingLeft:10 }}>
                                    {
                                        Platform.OS == 'ios' ?

                                            <RNPickerSelect
                                                selectedValue={idle}
                                                style={{ height: 50, width: '100%' }}
                                                placeholderTextColor="#ccc"
                                                items={[
                                                    { label: 'No', value: '0' },
                                                    { label: 'Yes', value: '1' },
                                                ]}
                                                onValueChange={(itemValue, itemIndex) => setIdle(itemValue)}>
                                            </RNPickerSelect>
                                            :
                                            <Picker
                                                selectedValue={idle}
                                                style={{ height: 40, width: '100%' }}
                                                onValueChange={(itemValue, itemIndex) => setIdle(itemValue)}
                                            >
                                                <Picker.Item label="No" value="0" />
                                                <Picker.Item label="Yes" value="1" />
                                            </Picker>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.flatlist}>
                        <Text style={styles.labeltxt}>Remarks</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            label="Remarks"
                            style={styles.inputr}
                            onChangeText={setRemarks}
                            value={remarks}
                        />
                    </View>
                {/* </ScrollView> */}
            </View>
            <View>
                <TouchableOpacity style={styles.btnContainer} onPress={() => submitform()}>
                    <Text style={styles.previewtxt}>Submit</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
export default MaintenanceTicket;
const styles = StyleSheet.create({
    mtop: {
        marginTop: 10,
    },
    mtxttop: {
        marginTop: 10,
    },
    labeltxt: {
        color: FONTCOLORS.primary,
        fontWeight: 'bold'
    },
    input: {
        height: 50,
        // margin: 12,
        borderWidth: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
    },
    inputr: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        height: 70,
        justifyContent: "flex-start",
        paddingLeft: 15,
    },
    button: {
        // borderRadius: 20,
        padding: 15,
        // elevation: 2,
        backgroundColor: 'transparent',
        borderWidth: 1,
        // bordercolor:'black'
        borderColor: COLORS.brdleftblue
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: '1%',
        marginBottom: 10,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.brdleftblue,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        fontWeight: 'bold',
        width: '98%',
        marginRight: '1%',
        marginLeft: '1%',
    },
    Flatlistview: {
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '30%',
        marginTop: '5%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    Containerremarks: {
        Width: '100%',
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20
    },
    row1: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        PaddingBottom: 10,
    },
    inputContainer2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
    },
    inputContainerhide2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
        display: 'none'
    },
    inputContainer: {
        width: "98%",
        marginLeft: '0%',
    },
    pickerView: {
        width: "98%",
        marginLeft: '0%',
    },
    textStyle: {
        color: 'black',
    }
})