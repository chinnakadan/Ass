import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, platform, Button, TextInput, BackHandler, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Transfer } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import Wizard from "react-native-wizard"
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import GeoPickList from '../../Components/geoPickList';
import MPickListG from '../../Components/mPickListg';
import AddOperator from '../../Components/AddOperator';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect  from 'react-native-picker-select';



const TDispatchEntry = (props) => {
    const { RegisterId } = props.route.params;
    const wizard = useRef()
    const [isFirstStep, setIsFirstStep] = useState(true)
    const [isLastStep, setIsLastStep] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');

    const [ccListItems, setCCListItems] = useState([]);
    const [ccData, setCCData] = useState([]);
    const [ccSearch, setCCSearch] = useState('');
    const [selectedAsset, setselectedAsset] = useState([]);
    const [approve, setApprove] = useState('N');

    const [tccListItems, setTCCListItems] = useState([]);
    const [tccData, setTCCData] = useState([]);
    const [tccSearch, setTCCSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');
    const [assetgroupData, setAssetGroupData] = useState([]);

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [tccId, setTCCId] = useState(0);
    const [tccName, setTCCName] = useState('');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [tccModalVisible, setTCCModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);

    const [issueType, setIssueType] = useState(1);
    const [transferTrans, setTransferTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [eWayBillNo, seteWayBillNo] = React.useState("");
    const [eWayBillAmt, seteWayBillAmt] = React.useState(0);
    const [screenshow, setscreenshow] = useState('0');
    const [nextShow, setNextShow] = React.useState(0);
    const [submitClick, setsubmitClick] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [totalTime, setTotalTime] = useState('');

    const [startReading, setStartReading] = useState('0');
    const [endReading, setEndReading] = useState('0');
    const [totalReading, setTotalReading] = useState('0');

    const [vehicleType, setVehicleType] = useState('1');
    const [vehicleNo, setvehicleNo] = useState('');
    const [vehicleName, setvehicleName] = useState('');
    const [vehicleId, setVehicleId] = useState(0);
    const [vehicleSearch, setVehicleSearch] = useState('');

    const [vehicleListItems, setVehicleListItems] = useState([]);
    const [vehicleData, setvehicleData] = useState([]);

    const [openingFuel, setOpeningFuel] = useState(0);
    const [closingFuel, setClosingFuel] = useState(0);
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [showFromTime, setShowFromTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const [geoFromModalVisible, setgeoFromModalVisible] = useState(false);
    const [geoToModalVisible, setgeoToModalVisible] = useState(false);

    const [operatorListItems, setOperatorListItems] = useState([]);
    const [operatorData, setOperatorData] = useState([]);
    const [operatorSearch, setOperatorSearch] = useState('');

    const [operatorId, setOperatorId] = useState(0);
    const [operatorName, setOperatorName] = useState('');
    const [operatorModalVisible, setOperatorModalVisible] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (ccData.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (ccId != 0 && tccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId, tccId]);
    useEffect(() => {
        removeAssetData();
        if (transferTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [transferTrans]);
    useEffect(() => {
        const backAction = () => {
            if (currentStep == 0) {
                Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                    {
                        text: "NO",
                        onPress: () => null,
                        style: "cancel"
                    },
                    { text: 'YES', onPress: () => props.navigation.goBack() },
                ]);
            } else {
                wizard.current.prev();
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [currentStep]);
    const retrieveData = async () => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
            if (RegisterId != 0) {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    RegisterId: RegisterId,
                    type: 'getedittransferdata'
                };
                const response = await Transfer(data);
                const datas = await response.json();
                const RegData = datas.regList;
                const vTrans = datas.vehicleTransList;
                setCCId(RegData.FCostCentreId);
                setCCName(RegData.FCostCentreName);
                setTCCId(RegData.TCostCentreId);
                setTCCName(RegData.TCostCentreName);
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                seteWayBillNo(RegData.EBillWayNo);
                seteWayBillAmt(RegData.EBillWayAmount);
                setAssetData(datas.assetList);
                setAssetListItems(datas.assetList);
                setMAssetData(datas.assetList);
                setAssetGroupData(datas.resList);
                setTransferTrans(datas.transList);
                setOperatorData(datas.operatorList);
                setOperatorListItems(datas.operatorList);
                if (vTrans) {
                    if (vTrans.VehicleType != 'O') setVehicleType('2');
                    else setVehicleType('1');
                    setVehicleId(vTrans.VehicleId);
                    setvehicleName(vTrans.VehicleName);
                    setvehicleNo(vTrans.VehicleNo);
                    setOpeningFuel(vTrans.OpeningFuel);
                    setStartTime(new Date(vTrans.StartTime));
                    setStartReading(vTrans.StartReading);
                    setFromLocation(vTrans.FromLocation);
                    setToLocation(vTrans.ToLocation);
                    setOperatorId(vTrans.OperatorId);
                    setOperatorName(vTrans.OperatorName);
                }
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getentryData",
                };
                const response = await Transfer(data)
                const datas = await response.json();
                setCCData(datas.ccList);
                setCCListItems(datas.ccList);
                setOperatorData(datas.operatorList);
                setOperatorListItems(datas.operatorList);
                setvehicleData(datas.vehicleList);
                setVehicleListItems(datas.vehicleList);
                getCurrentLocation();
            }
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
                setFromLocation(json.results[0].formatted_address);
            })
        )
    }
    function handleConfirmFrom(argValue) {
        // console.log(argValue.toString());
        // console.log(FormatDate(argValue),'test');
        setStartTime(argValue);
        setShowFromTime(false);
    }
    function handleConfirmEnd(argValue) {
        // console.log(argValue.toString());
        // console.log(FormatDate(argValue),'test');
        setEndTime(argValue);
        setShowEndTime(false);
    }
    function hideDatePickerFrom() {
        setShowFromTime(false);
    }
    function hideDatePickerEnd() {
        setShowEndTime(false);
    }
    function actionOnFromLocation(item) {
        setFromLocation(item);
        setgeoFromModalVisible(false);
    }
    function actionOnToLocation(item) {
        setToLocation(item);
        setgeoToModalVisible(false);
    }
    const onChangeSearchCC = (query) => {
        try {
            if (query) {
                const newData = ccListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setCCData(newData);
                setCCSearch(query);
            } else {
                setCCData(ccListItems);
                setCCSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchTCC = (query) => {
        try {
            if (query) {
                const newData = tccListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setTCCData(newData);
                setTCCSearch(query);
            } else {
                setTCCData(tccListItems);
                setTCCSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchVehicle = (query) => {
        try {
            if (query) {
                const newData = vehicleListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setvehicleData(newData);
                setVehicleSearch(query);
            } else {
                setvehicleData(vehicleListItems);
                setVehicleSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchOperator = (query) => {
        try {
            if (query) {
                const newData = operatorListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setOperatorData(newData);
                setOperatorSearch(query);
            } else {
                setOperatorData(operatorListItems);
                setOperatorSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchAsset = (query) => {
        try {
            if (query) {
                const newData = assetListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setAssetData(newData);
                setAssetSearch(query);
            } else {
                setAssetData(assetListItems);
                setAssetSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const actionOnRowCC = async (item) => {
        setCCName(item.Name);
        setCCModalVisible(false);
        var iCostcentreId = item.Id;
        setCCId(iCostcentreId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getCCAssetData'
        };
        const response = await Transfer(data)
        var datas = await response.json();
        setTCCData(datas.ccList);
        setTCCListItems(datas.ccList);
        setAssetData(datas.assetList);
        setAssetListItems(datas.assetList);
        setMAssetData(datas.assetList);
        setAssetGroupData(datas.resList);
    }
    const actionOnRowTCC = async (item) => {
        setTCCName(item.Name);
        setTCCModalVisible(false);
        var iCCId = item.Id;
        setTCCId(iCCId);
    }
    const actionOnRowVehicle = async (item) => {
        setvehicleName(item.Name);
        setVehicleModalVisible(false);
        var iVehicleId = item.Id;
        setVehicleId(iVehicleId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            AssetId: iVehicleId,
            type: 'getVehicleDetails'
        };
        const response = await Transfer(data)
        var datas = await response.json();
        setvehicleNo(datas.vehicleNo);
        setStartReading(datas.openingReading);
        setOpeningFuel(datas.openingFuel);
    }
    const actionOnRowOperator = async (item) => {
        setOperatorName(item.Name);
        setOperatorModalVisible(false);
        var ioperatorId = item.Id;
        setOperatorId(ioperatorId);
    }
    const actionOnRowAsset = async (item) => {
        if (item.length > 0) {
            let sAssetIds = '';
            item.map((userData) => {
                sAssetIds = sAssetIds + userData.toString() + ','
            });
            getAsset(sAssetIds);
            setAssetModalVisible(false);
            wizard.current.next();
        } else {
            alert('Select Asset');
            setAssetModalVisible(true);
        }
    }
    const actionOnRowAssetAdd = async (item) => {
        if (item.length > 0) {
            let sAssetIds = '';
            item.map((userData) => {
                sAssetIds = sAssetIds + userData.toString() + ','
            });
            getAsset(sAssetIds);
            setAssetAddModalVisible(false);
        } else {
            alert('Select Asset');
            setAssetAddModalVisible(true);
        }
    }
    function removeAssetData() {
        if (transferTrans.length > 0) {
            let tmptrans = [...assetListItems];
            transferTrans.map((userData) => {
                let iAssetId = userData.AssetId;
                let index = tmptrans.findIndex(el => el.Id === iAssetId);
                if (index !== -1) tmptrans.splice(index, 1);
            });
            setAssetData(tmptrans);
            setAssetListItems(tmptrans);
        };
    }
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    function tccHandleChange() {
        setTCCModalVisible(false)
    }
    function assethandleChange() {
        setAssetModalVisible(false)
    }
    function vehicleHandleChange() {
        setVehicleModalVisible(false)
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
    }
    function operatorHandleChange() {
        setOperatorModalVisible(false)
    }
    function closeform() {
        if (RegisterId == 0) {
            Alert.alert("Exit!", "Are you sure to exit from this screen?", [
                {
                    text: "NO",
                    onPress: () => null,
                    style: "cancel"
                },
                { text: 'YES', onPress: () => props.navigation.goBack() },
            ]);
        } else {
            props.navigation.goBack();
        }
    }
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (ccId == 0) {
            setsubmitClick(false);
            alert("Select From Costcentre");
            return;
        }
        if (tccId == 0) {
            setsubmitClick(false);
            alert("Select To Costcentre");
            return;
        }
        if (transferTrans.length == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        let bQtyFound = false;
        for (var trans of transferTrans) {
            if (CommonFun.FloatVal(trans['Qty']) != 0) {
                bQtyFound = true;
                break;
            }
        }
        if (bQtyFound == false) {
            setsubmitClick(false);
            alert("No Qty Entered")
            return;
        }
        setLoading(true);
        updateData();
    }
    function deleteRow(argId) {
        Alert.alert('Delete Confirmation!', 'Are you sure you want to delete?',
            [{ text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'OK', onPress: () => deleteAssetRow(argId) },],
            { cancelable: false }
        );
    }
    function deleteAssetRow(argId) {
        let mindex = massetData.findIndex(el => el.Id === argId);
        if (mindex !== -1) {
            let tempTrans = [...assetListItems];
            tempTrans.push(massetData[mindex]);
            setAssetData(tempTrans);
            setAssetListItems(tempTrans);
        }
        let tmptrans = [...transferTrans];
        let index = tmptrans.findIndex(el => el.AssetId === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setTransferTrans(tmptrans);
        }
    }
    function showAssetList() {
        if (transferTrans.length > 0 || RegisterId != 0) {
            wizard.current.next();
        } else {
            if (ccId == 0) {
                alert("Select From CostCentre");
                return;
            }
            if (tccId == 0) {
                alert("Select To CostCentre");
                return;
            }
            setAssetModalVisible(true);
            return false;
        }
    }
    const updateData = async () => {
        let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                FCostcentreId: ccId,
                TCostcentreId: tccId,
                eWayBillNo: eWayBillNo,
                eWayBillAmt: eWayBillAmt,
                vehicleType: vehicleType,
                vehicleId: vehicleId,
                vehicleName: vehicleName,
                vehicleNo: vehicleNo,
                startReading: startReading,
                startTime: dstartTime,
                openingFuel: openingFuel,
                fromLocation: fromLocation,
                toLocation: toLocation,
                OperatorId: operatorId,
                trans: transferTrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updateTransfer",
            };
            const response = await Transfer(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.navigate('TransferMenu');
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
    const getAsset = async (sAssetIds) => {
        try {
            if (sAssetIds == '') return;
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                CostCentreId: ccId,
                assetIds: sAssetIds,
                issueType: issueType,
                type: "getAssetData",
            };
            const response = await Transfer(data);
            const datas = await response.json();
            let tempTrans = [...transferTrans];
            tempTrans.push(...datas);
            setTransferTrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
    function checkQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...transferTrans];
        let index = tmptrans.findIndex(el => el.AssetId === argId);
        let dAQty = CommonFun.FloatVal(tmptrans[index]['AvailQty']);
        if (CommonFun.FloatVal(dQty) > dAQty) {
            alert("Qty greater than available Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setTransferTrans(tmptrans);
        return dQty;
    }
    function goNext() {
        if (currentStep == 0) {
            showAssetList();
        } else {
            wizard.current.next();
        }
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>From CostCentre</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={ccModalVisible} data={ccData} onChange={ccHandleChange} onChangeSearch={onChangeSearchCC} search={ccSearch} actionOnCancel={setCCModalVisible} actionOnRow={actionOnRowCC} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setCCModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{ccName ? ccName : 'Select From CostCentre'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>To CostCentre</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={tccModalVisible} data={tccData} onChange={tccHandleChange} onChangeSearch={onChangeSearchTCC} search={tccSearch} actionOnCancel={setTCCModalVisible} actionOnRow={actionOnRowTCC} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setTCCModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{tccName ? tccName : 'Select To CostCentre'}</Text>
                    </Pressable>
                </View>
            </View>
            <MPickListG visible={assetModalVisible} data={assetData} listdata={assetListItems} gdata={assetgroupData} onChange={assethandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetModalVisible} actionOnRow={actionOnRowAsset} />
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={approve == 'Y' ? styles.hide : styles.inputContainer2}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickListG visible={assetAddModalVisible} data={assetData} listdata={assetListItems} gdata={assetgroupData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add Asset</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <ScrollView> */}
                <View style={{ marginBottom: 50 }}>
                    <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                        data={transferTrans}
                        keyExtractor={item => item.AssetId}
                        renderItem={({ item, index }) => {
                            return <View  ><TouchableOpacity style={styles.touch}>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col7}>
                                        <Text style={styles.itemTitle2}> {item.AssetName.slice(0, 15)}   <Text style={styles.unit}>({item.UnitName})</Text> </Text>
                                    </View>
                                    <View style={approve == 'Y' ? styles.hide : styles.deleteicon}>
                                        <TouchableOpacity onPress={() => deleteRow(item.AssetId)}>
                                            {/* <Text style={styles.deletetext}>Delete</Text> */}
                                            <Icon name='delete' size={25} color='red' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.marg5}></View>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col3}>
                                        <Text style={styles.availableQty} >Avail .Qty :</Text>
                                    </View>
                                    <View style={styles.colw25}>
                                        <Text style={styles.itemtittle}> {item.AvailQty}</Text>
                                    </View>
                                    <View style={styles.col2}>
                                        <Text style={styles.enterQty}>Qty:</Text>
                                    </View>
                                    <View style={styles.col3}>
                                        <TextInput
                                            style={styles.input}
                                            value={item.Qty ? item.Qty.toString() : ''}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            onChangeText={text => checkQty(text, item.AssetId)}
                                            editable={approve == 'Y' ? false : true}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            </View>
                        }}
                    />
                </View>
            {/* </ScrollView> */}
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%', backgroundColor: 'white' }} >
            {/* <ScrollView> */}
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime}>Vechicle Type</Text>
                        </View>
                        <View style={styles.col70}>
                            <View style={{ borderWidth: 1, borderColor:COLORS.brdleftblue ,height:50,paddingLeft:10,paddingTop:15,}}>
                                {  
                               Platform.OS == 'android' ?
                                    <Picker
                                        selectedValue={vehicleType}
                                        style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                        onValueChange={(itemValue, itemIndex) => setVehicleType(itemValue)}
                                    >
                                        <Picker.Item label="Own" value="1" />
                                        <Picker.Item label="Others" value="2" />
                                    </Picker>
                                    : <RNPickerSelect
                                        selectedValue={vehicleType}
                                        style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                        placeholderTextColor="#ccc"
                                        items={[
                                            { label: 'Own', value: '1' },
                                            { label: 'Others', value: '2' },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => setVehicleType(itemValue)}>
                                    </RNPickerSelect>}
                            </View>
                        </View>
                    </View>
                </View>
                <View style={vehicleType == 1 ? styles.row : styles.hide}>
                    <View style={[styles.row1, { marginTop: 10 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Vechicle Name</Text>
                        </View>
                        <View style={styles.col70}>
                            <SPickList visible={vehicleModalVisible} data={vehicleData} onChange={vehicleHandleChange} onChangeSearch={onChangeSearchVehicle} search={vehicleSearch} actionOnCancel={setVehicleModalVisible} actionOnRow={actionOnRowVehicle} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setVehicleModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{vehicleName ? vehicleName : 'Select Vehicle Name'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={vehicleType == 2 ? styles.row : styles.hide}>
                    <View style={[styles.row1, { marginTop: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Vehicle Name</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={[styles.input, { textAlign: 'left' }]}
                                value={vehicleName}
                                // keyboardType="numeric"
                                maxLength={50}
                                onChangeText={setvehicleName}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
                {/* <View style={styles.row}>
                    <View style={[styles.row1, style = { marginTop: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Vehicle Name</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input1}
                                value={vehicleName}
                                // keyboardType="numeric"
                                maxLength={50}
                                onChangeText={setvehicleName}
                            />
                        </View>
                    </View>
                </View> */}
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Vehicle No</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={[styles.input, { textAlign: 'left' }]}
                                value={vehicleNo}
                                // keyboardType="numeric"
                                maxLength={50}
                                onChangeText={setvehicleNo}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Start Reading</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={startReading ? startReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={setStartReading}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Start Time</Text>
                        </View>
                        <View style={styles.col70}>
                            <DateTimePickerModal
                                isVisible={showFromTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmFrom(date)}
                                onCancel={hideDatePickerFrom}
                                date={startTime}
                                //value={startTime}
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                        marginLeft: 0,
                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        borderWidth: 1,
                                        borderColor:COLORS.inputborder,
                                        justifyContent: 'flex-start',
                                        height: 40,
                                        alignItems: 'flex-start',
                                        paddingTop: 15,
                                        paddingLeft: 10,
                                    },
                                }}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setShowFromTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(startTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View>
                    {/* <View style={[styles.row1, style = { marginTop: 3, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >End Time</Text>
                        </View>
                        <View style={styles.col70}>

                            <DateTimePickerModal
                                isVisible={showEndTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmEnd(date)}
                                onCancel={hideDatePickerEnd}
                                // date={Date(startTime)}
                                value={endTime}
                                customStyles={{
                                    dateIcon: {

                                        position: 'absolute',
                                        right: 0,
                                        top: 4,
                                        marginLeft: 0,
                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        borderWidth: 1,
                                        borderColor: '#a7b7d9',
                                        justifyContent: 'flex-start',
                                        height: 50,
                                        alignItems: 'flex-start',
                                        paddingTop: 15,
                                        paddingLeft: 10,

                                    },
                                }}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setShowEndTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(endTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View> */}
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Opening Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={openingFuel ? openingFuel.toString() :''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={approve == 'Y' ? false : true}
                                onChangeText={setOpeningFuel}
                            // editable={false}
                            />
                        </View>
                    </View>
                    {/* <View style={[styles.row1, style = { marginTop: 3, marginBottom: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Colsing Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={0}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateClosingFuel(text)}
                            />
                        </View>
                    </View> */}
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 10, height: 40, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.collocation} >From Location</Text>
                        </View>
                        <View style={styles.col70}>
                            <Pressable
                                onPress={() => setgeoFromModalVisible(true)}>
                                <Text style={styles.Locationinput}>{fromLocation ? fromLocation : 'Select'}
                                    <GeoPickList styles={{ height: 1, width: 1 }} visible={geoFromModalVisible} data={fromLocation} actionOnCancel={setgeoFromModalVisible} actionOnRow={actionOnFromLocation} />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 3, marginBottom: 10, height: 40, }]}>
                        <View style={styles.col3}>
                            <Text style={[styles.collocation, { marginTop: 15 }]} >To Location</Text>
                        </View>
                        <View style={styles.col70}>
                            <Pressable
                                onPress={() => setgeoToModalVisible(true)}>
                                <Text style={styles.Locationinput1}>{toLocation ? toLocation : 'Select'}
                                    <GeoPickList styles={{ height: 1, width: 1 }} visible={geoToModalVisible} data={toLocation} actionOnCancel={setgeoToModalVisible} actionOnRow={actionOnToLocation} />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={[styles.row1, style = { marginTop: 32, height: 50, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.collocation} >Operator Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <View style={styles.centeredView}>
                            <AddOperator visible={operatorModalVisible} data={operatorData} listitem={operatorListItems} setdata={setOperatorData} setlistitem={setOperatorListItems} onChange={operatorHandleChange} onChangeSearch={onChangeSearchOperator} search={operatorSearch} actionOnCancel={setOperatorModalVisible} actionOnRow={actionOnRowOperator} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen, { height: 50, width: '98%' }]}
                                onPress={() => setOperatorModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{operatorName ? operatorName : 'Select Operator Name'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            {/* </ScrollView> */}
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={styles.Flatlistview}>
                <View style={styles.col49}>
                    <Text style={styles.labeltxt}>EWayBill No</Text>
                    <TextInput
                        label="EWayBill No"
                        style={styles.input}
                        onChangeText={seteWayBillNo}
                        value={eWayBillNo}
                        editable={approve == 'Y' ? false : true}
                    />
                </View>
                <View style={styles.col49}>
                    <Text style={styles.labeltxt}>EWayBill Amount</Text>
                    <TextInput
                        label="EWayBill Amount"
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={seteWayBillAmt}
                        maxLength={10}
                        value={eWayBillAmt ? eWayBillAmt.toString() : ''}
                        editable={approve == 'Y' ? false : true}
                    />
                </View>
                <View style={styles.col3}>
                </View>
            </View>
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>Remarks</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={10}
                    label="Remarks"
                    style={styles.inputremarks}
                    onChangeText={setRemarks}
                    value={remarks}
                    editable={approve == 'Y' ? false : true}
                />
            </View>
            <View style={styles.row1}>
                <View style={[styles.Flatlistview1, { marginTop: 10 }]}>
                    <View style={styles.col50}>
                        <View>
                            <TouchableOpacity style={styles.submitbtnContainer1} onPress={() => closeform()}>
                                <Text style={styles.previewtxt}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.col50}>
                        <View style={approve == 'Y' ? styles.hide : ''}>
                            <TouchableOpacity style={styles.submitbtnContainer} onPress={() => submitform()}>
                                <Text style={styles.previewtxt}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }]
    return (
        <>
            <Loader loading={loading} />
            <View
                style={[wizardShow == false ? styles.hide : '', {
                    justifyContent: "space-between", flexDirection: "row", backgroundColor: COLORS.white,
                    borderBottomColor: "#dedede", borderBottomWidth: 1,marginTop: 2, marginBottom: 2
                }]}>
                <Button disabled={isFirstStep} title="Prev" color={COLORS.primary} onPress={() => wizard.current.prev()} />
                <Text>Step {currentStep + 1}. of 4</Text>
                <Button disabled={isLastStep} title="Next" color={COLORS.primary} onPress={() => goNext()} />
            </View>
            <View style={{ width: '100%' }}>
                <Wizard style={{ backgroundColor: 'yellow' }}
                    ref={wizard}
                    steps={stepList}
                    isFirstStep={val => setIsFirstStep(val)}
                    isLastStep={val => setIsLastStep(val)}
                    currentStep={({ currentStep, isLastStep, isFirstStep }) => {
                        setCurrentStep(currentStep)
                    }}
                />
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    {stepList.map((val, index) => (
                        <View
                            key={"step-indicator-" + index}
                            style={{
                                width: 10, marginHorizontal: 6, height: 10, borderRadius: 5,
                                backgroundColor: index === currentStep ? "#141c12" : "#9ea69c",
                            }}
                        />
                    ))}
                </View>
            </View>
        </>
    );
}
export default TDispatchEntry;
const styles = StyleSheet.create({
    mtxttop: {
        margin: 10,
    },
    labeltxt: {
        color: FONTCOLORS.primary,
        fontWeight: 'bold'
    },
    hide: {
        display: 'none'
    },
    input: {
        height: 35,
        borderWidth: 1,
        padding: 10,
        width: '30%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'right'
    },
    input1: {
        height: 35,
        borderWidth: 1,
        padding: 10,
        width: '30%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left'
    },
    inputremarks: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        height: 70,
        justifyContent: "flex-start",
        paddingLeft: 15,
        paddingRight: 10,
    },
    button: {
        padding: 15,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 1,
        marginBottom: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor:COLORS.primary,
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
    itemTitle: {
        color: 'black',
        paddingBottom: 10,
        fontWeight: 'bold',
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
    unit: {
        flex: 0,
        color: 'black',
        // fontWeight: 'bold',
        textAlign: 'right',
        paddingTop: 10,
        paddingRight: 10,
        fontSize: 13,
    },
    Flatlistview:
    {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        paddingHorizontal: 5,
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,
    },
    previewtxt:
    {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        borderLeftColor:COLORS.primary,
        padding: 5,
        borderRadius: 5,
        maxWidth: '25%',
        marginLeft: '10%',
        alignItems: "center",
        justifyContent: "center",
    },
    submitbtnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderLeftColor:COLORS.primary,
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '40%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    btnContainernewbtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.green,
        padding: 5,
        borderRadius: 5,
        // marginLeft: '65%',
        maxWidth: '50%',
        alignItems: "center",
        justifyContent: "center",
    },
    itemtittle:
    {
        color: '#646569',
        textAlign: 'left',
        padding: 2,
        fontSize: 14,
        paddingTop: 10,
        color: '#5c6773',
    },
    row1: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",

        PaddingBottom: 10,
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,

    },
    inputContainer2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
        padding: 1,
    },
    nextContainer:
    {
        marginTop: 15,
        width: "35%",
        marginLeft: '60%',
        marginVertical: 1,
        padding: 1,
    },
    inputContainer: {
        width: "98%",
        marginLeft: '0%',
    },
    pickerView: {
        width: "98%",
        marginLeft: '0%',
    },
    row:
    {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",

        backgroundColor: COLORS.white,
        PaddingBottom: 10,
    },
    btnContainerprenxt: {
        flexDirection: 'row',
        backgroundColor:COLORS.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '100%',
        marginLeft: '10%',
        alignItems: "center",
        justifyContent: "center",
    },
    col3: {
        width: '29%',
    },
    col48: {
        width: '46.5%',
        marginLeft: '2.5%'
    },
    col7: {
        width: '82%',
    },
    col2: {
        width: '18%',
    },
    col3: {
        width: '28%',
    },
    colw25: {
        width: '20%',
    },
    colon:
    {
        paddingTop: 10,
    },
    itemtittle:
    {
        paddingTop: 10,
    },
    Locationinput:
    {
        height: 50,
        paddingHorizontal: 15,
        paddingVertical: 0,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 13,
    },
    Locationinput1:
    {
        height: 50,
        paddingHorizontal: 15,
        paddingVertical: 7,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 13,
        marginTop: 20,
    },
    input: {
        height: 50,
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'right',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    itemTitle2: {
        textAlign: 'center', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: FONTCOLORS.primary,
    },
    availableQty:
    {
        paddingTop: 10,
        color: '#02691a',
        fontWeight: 'bold',
    },
    enterQty:
    {
        paddingTop: 10,
        color: '#067a96',
        fontWeight: 'bold',
    },
    deletetext:
    {
        color: '#fff',
        textAlign: 'center',
    },
    deleteicon:
    {
        backgroundColor: COLORS.white,
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        width: '18%',
    },
    marg5:
    {
        margin: 2,
    },
    textStyle:
    {
        color: 'black',

    },
    submitbtnContainer1: {
        flexDirection: 'row',
        backgroundColor: '#99a1ad',
        marginRight: 0,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '40%',
        marginLeft: '35%',

        alignItems: "center",
        justifyContent: "center",
    },
    col50: {
        width: '50%',
    },
    col31: {
        width: '31%',
    },
    col70: {
        width: '70%',
    },
    colsplit: {
        width: '3%',
    },
    colheader:
    {
        paddingTop: 10,
        //  color: '#02691a',
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    textInput:
    {
        color: 'black'
    },
    coltimeleft: {
        paddingTop: 10,
        marginLeft: 2,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    coltime:
    {
        paddingTop: 15,
        marginLeft: 5,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 14,
    },
    collocation: {
        paddingTop: 15,
        marginLeft: 5,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    col49: {
        width: '49%',
        marginLeft: '0.5%'
    },
})