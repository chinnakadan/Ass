import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView, Platform, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Pdispatch } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import Wizard from "react-native-wizard"
import SPickList from '../../Components/sPickList';
import MPickList from '../../Components/mPickList';
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GeoPickList from '../../Components/geoPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AddOperator from '../../Components/AddOperator';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const PDispatchEntry = (props) => {

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

    const [clientListItems, setClientListItems] = useState([]);
    const [clientData, setClientData] = useState([]);
    const [clientSearch, setClientSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [tccId, setTCCId] = useState(0);
    const [tccName, setTCCName] = useState('');

    const [pclientId, setPClientId] = useState(0);
    const [pclientName, setPClientName] = useState('');

    const [productData, setProductData] = useState([]);
    const [productId, setProductId] = useState(0);

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [tccModalVisible, setTCCModalVisible] = useState(false);
    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);

    const [dispatchQty, setDispatchQty] = useState(0);
    const [stockQty, setStockQty] = useState(0);
    const [supplyType, setSupplyType] = useState(1);
    const [transferTrans, setTransferTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');
    const [selvehicledisabled, setselvehicledisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [submitClick, setsubmitClick] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [secstartTime, setSecStartTime] = useState(new Date());

    const [endTime, setEndTime] = useState(new Date());
    const [totalTime, setTotalTime] = useState('');

    const [startReading, setStartReading] = useState('0');
    const [secstartReading, setSecStartReading] = useState('0');
    const [endReading, setEndReading] = useState('0');
    const [totalReading, setTotalReading] = useState('0');

    const [hoListItems, sethoListItems] = useState([]);
    const [hoData, sethoData] = useState([]);
    const [hoSearch, sethoSearch] = useState('');
    const [hoId, sethoId] = useState(0);
    const [hoName, sethoName] = useState('');
    const [hoModalVisible, sethoModalVisible] = useState(false);

    const [soListItems, setsoListItems] = useState([]);
    const [soData, setsoData] = useState([]);
    const [soSearch, setsoSearch] = useState('');
    const [soId, setsoId] = useState(0);
    const [soName, setsoName] = useState('');
    const [soModalVisible, setsoModalVisible] = useState(false);

    const [hovehicleListItems, sethoVehicleListItems] = useState([]);
    const [hovehicleData, sethovehicleData] = useState([]);
    const [hovehicleSearch, sethoVehicleSearch] = useState('');
    const [hovehicleId, sethoVehicleId] = useState(0);
    const [hovehicleName, sethovehicleName] = useState('');
    const [hovehicleModalVisible, sethoVehicleModalVisible] = useState(false);

    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState(0);

    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    const [vehicleType, setVehicleType] = useState('1');
    const [vehicleNo, setvehicleNo] = useState('');
    const [vehicleName, setvehicleName] = useState('');
    const [ovehicleName, setovehicleName] = useState('');
    const [vehicleId, setVehicleId] = useState(0);
    const [vehicleSearch, setVehicleSearch] = useState('');

    const [vehicleListItems, setVehicleListItems] = useState([]);
    const [vehicleData, setvehicleData] = useState([]);

    const [openingFuel, setOpeningFuel] = useState(0);
    const [closingFuel, setClosingFuel] = useState(0);
    const [secAssetId, setSecAssetId] = useState(0);
    const [secopeningFuel, setSecOpeningFuel] = useState(0);
    const [secclosingFuel, setSecClosingFuel] = useState(0);
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [showFromTime, setShowFromTime] = useState(false);

    const [secshowFromTime, setSecShowFromTime] = useState(false);

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
        if (ccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId]);
    useEffect(() => {
        removeAssetData();
        if (transferTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
        calculateProdQty();
    }, [transferTrans]);
    useEffect(() => {
        if (vehicleId != 0) setselvehicledisabled('none');
        else setselvehicledisabled('auto');
    }, [vehicleId]);

    useEffect(() => {
        // props.navigation.setOptions({ headerShown: screenshow == 0 ? true : false });
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
                    type: 'geteditdata'
                };
                const response = await Pdispatch(data);
                const datas = await response.json();
                const RegData = datas.regList;
                const vTrans = datas.vehicleTransList;
                setCCId(RegData.PlantCostCentreId);
                setCCName(RegData.PlantCostCentreName);
                if (RegData.TransType == 'S') setSupplyType(2);
                else setSupplyType(1);
                setTCCId(RegData.CostCentreId);
                setTCCName(RegData.CostCentreName)
                setPClientId(RegData.ClientId);
                setPClientName(RegData.ClientName);
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                setProductData(datas.productionList);
                setProductId(datas.ProductId)
                setAssetData(datas.requestList);
                setAssetListItems(datas.requestList);
                setMAssetData(datas.requestList);
                setTransferTrans(datas.transList);
                if (vTrans) {
                    if (vTrans.VehicleType == 'H') setVehicleType('2');
                    else if (vTrans.VehicleType == 'S') setVehicleType('3');
                    else if (vTrans.VehicleType == 'C') setVehicleType('4');
                    else setVehicleType('1');
                    if (vTrans.VehicleType == 'O') {
                        setVehicleId(vTrans.VehicleId);
                        setovehicleName(vTrans.VehicleName);
                    } else if (vTrans.VehicleType == 'H') {
                        sethoVehicleId(vTrans.VehicleId);
                        sethovehicleName(vTrans.VehicleName);
                        sethoId(vTrans.HOId);
                        sethoName(vTrans.HONo);
                    } else if (vTrans.VehicleType == 'S') {
                        setsoId(vTrans.SOId);
                        setsoName(vTrans.SONo);
                        setvehicleName(vTrans.VehicleName);
                    } else {
                        setvehicleName(vTrans.VehicleName);
                    }
                    setvehicleNo(vTrans.VehicleNo);
                    setOpeningFuel(vTrans.OpeningFuel);
                    setStartTime(new Date(vTrans.StartTime));
                    setStartReading(vTrans.StartReading);
                    setFromLocation(vTrans.FromLocation);
                    setToLocation(vTrans.ToLocation);
                    setOperatorId(vTrans.OperatorId);
                    setOperatorName(vTrans.OperatorName);
                    setSecAssetId(vTrans.SecAssetId);
                    setSecStartTime(new Date(vTrans.SecStartTime));
                    setSecStartReading(vTrans.SecStartReading);
                    setSecOpeningFuel(vTrans.SecOpeningFuel);
                }
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getentryData",
                };
                const response = await Pdispatch(data)
                const datas = await response.json();
                setCCData(datas.ccList);
                setCCListItems(datas.ccList);
                setTCCData(datas.tccList);
                setTCCListItems(datas.tccList);
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
    const onChangeSearchho = (query) => {
        try {
            if (query) {
                const newData = hoListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                sethoData(newData);
                sethoSearch(query);
            } else {
                sethoData(hoListItems);
                sethoSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const onChangeSearchso = (query) => {
        try {
            if (query) {
                const newData = soListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setsoData(newData);
                setsoSearch(query);
            } else {
                setsoData(soListItems);
                setsoSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    function calculateProdQty() {
        var dTotQty = 0;
        if (transferTrans.length > 0) {
            transferTrans.map((item) => {
                dTotQty = dTotQty + CommonFun.FloatVal(item.Qty);
            });
            setDispatchQty(dTotQty);
        }
    }

    function actionOnFromLocation(item) {
        setFromLocation(item);
        setgeoFromModalVisible(false);
    }
    function actionOnToLocation(item) {
        setToLocation(item);
        setgeoToModalVisible(false);
    }
    const onChangeSearchClient = (query) => {
        try {
            if (query) {
                const newData = clientListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setClientData(newData);
                setClientSearch(query);
            } else {
                setClientData(clientListItems);
                setClientSearch(query);
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
    const onChangeSearchVehicleho = (query) => {
        try {
            if (query) {
                const newData = hovehicleListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                sethovehicleData(newData);
                sethoVehicleSearch(query);
            } else {
                sethovehicleData(hovehicleListItems);
                sethoVehicleSearch(query);
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
    const actionOnRowCC = async (item) => {
        //  console.log(item, 'Production Dispatch=================>>>');
        setCCName(item.Name);
        setCCModalVisible(false);
        var iCostcentreId = item.Id;
        setCCId(iCostcentreId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getProductList'

        };
        const response = await Pdispatch(data)
        var datas = await response.json();
        setProductData(datas);
    }
    const actionOnRowTCC = async (item) => {
        setTCCName(item.Name);
        setTCCModalVisible(false);
        var iCCId = item.Id;
        setTCCId(iCCId);
    }
    const actionOnRowho = async (item) => {
        sethoName(item.Name);
        sethoModalVisible(false);
        var ihoId = item.Id;
        sethoId(ihoId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            OrderId: ihoId,
            type: 'gethireVechile'
        };
        const response = await Pdispatch(data)
        var datas = await response.json();
        sethovehicleData(datas);
        sethoVehicleListItems(datas);
    }
    const actionOnRowso = async (item) => {
        setsoName(item.Name);
        setsoModalVisible(false);
        var isoId = item.Id;
        setsoId(isoId);
    }
    const actionOnRowClient = async (item) => {
        setPClientName(item.Name);
        setClientModalVisible(false);
        var iCCId = item.Id;
        setPClientId(iCCId);
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
    const actionOnRowVehicle = async (item) => {
        setovehicleName(item.Name);
        setVehicleModalVisible(false);
        var iVehicleId = item.Id;
        setVehicleId(iVehicleId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            OAssetId: iVehicleId,
            HAssetId: 0,
            OrderId: 0,
            type: 'getVehicleDetails'
        };
        const response = await Pdispatch(data)
        var datas = await response.json();
        setvehicleNo(datas.vehicleNo);
        setStartReading(datas.openingReading);
        setOpeningFuel(datas.openingFuel);
        setSecStartReading(datas.secopeningReading);
        setSecOpeningFuel(datas.secopeningFuel);
        setSecAssetId(datas.secAssetId);
    }
    const actionOnRowVehicleho = async (item) => {
        sethovehicleName(item.Name);
        sethoVehicleModalVisible(false);
        var iVehicleId = item.Id;
        sethoVehicleId(iVehicleId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            OAssetId: 0,
            HAssetId: iVehicleId,
            OrderId: hoId,
            type: 'getVehicleDetails'
        };
        const response = await Pdispatch(data)
        var datas = await response.json();
        setvehicleNo(datas.vehicleNo);
        setStartReading(datas.openingReading);
        setOpeningFuel(datas.openingFuel);
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
    const actionOnRowOperator = async (item) => {
        setOperatorName(item.Name);
        setOperatorModalVisible(false);
        var ioperatorId = item.Id;
        setOperatorId(ioperatorId);
    }
    function removeAssetData() {
        if (transferTrans.length > 0) {
            let tmptrans = [...assetListItems];
            transferTrans.map((userData) => {
                let iRequestId = userData.RequestId;
                let index = tmptrans.findIndex(el => el.Id === iRequestId);
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
    function hoHandleChange() {
        sethoModalVisible(false)
    }
    function soHandleChange() {
        setsoModalVisible(false)
    }
    function clientHandleChange() {
        setClientModalVisible(false)
    }
    function assethandleChange() {
        setAssetModalVisible(false)
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
    }
    function vehicleHandleChange() {
        setVehicleModalVisible(false)
    }
    function hovehicleHandleChange() {
        sethoVehicleModalVisible(false)
    }
    function hideDatePickerFrom() {
        setShowFromTime(false);
    }
    function operatorHandleChange() {
        setOperatorModalVisible(false)
    }
    function handleConfirmFrom(argValue) {
        setStartTime(argValue);
        setShowFromTime(false);
    }
    function handleConfirmFromSec(argValue) {
        setSecStartTime(argValue);
        setSecShowFromTime(false);
    }
    function hideDatePickerFromSec() {
        setSecShowFromTime(false);
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
        let index = tmptrans.findIndex(el => el.RequestId === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setTransferTrans(tmptrans);
        }
    }
    const getRequestList = async (argValue) => {
        if (supplyType == 1) {
            if (ccId == 0 || tccId == 0 || argValue == 0) {
                setAssetData([]);
                setAssetListItems([]);
                setProductId(argValue);
                return;
            }
        } else {
            if (ccId == 0 || pclientId == 0 || argValue == 0) {
                setAssetData([]);
                setAssetListItems([]);
                setProductId(argValue);
                return;
            }
        }
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                PCostCentreId: ccId,
                CostCentreId: tccId,
                ProductId: argValue,
                pClientId: pclientId,
                supplyType: supplyType,
                type: "getRequestList",
            };
            const response = await Pdispatch(data);
            const datas = await response.json();
            setAssetData(datas.requestList);
            setAssetListItems(datas.requestList);
            setMAssetData(datas.requestList);
            sethoData(datas.hoList);
            sethoListItems(datas.hoList);
            setsoData(datas.soList);
            setsoListItems(datas.soList);
            setStockQty(datas.stockQty);
            setProductId(argValue);
        } catch (error) {
            console.log(error)
        }
    }
    function changeVehicleType(argValue) {
        setVehicleType(argValue);
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
        }
    }
    function goNext() {
        if (currentStep == 0) {
            showAssetList();
        } else {
            wizard.current.next();
        }
    }
    const updateData = async () => {
        let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
        let dsecstartTime = Moment(secstartTime).format('YYYY-MMM-DD HH:mm:ss');
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                PCostCentreId: ccId,
                CostCentreId: tccId,
                ProductId: productId,
                supplyType: supplyType,
                pClientId: pclientId,
                vehicleType: vehicleType,
                vehicleId: vehicleId,
                hovehicleId: hovehicleId,
                hoId: hoId,
                soId: soId,
                dispatchQty: dispatchQty,
                stockQty: stockQty,
                vehicleName: vehicleName,
                vehicleNo: vehicleNo,
                startReading: startReading,
                startTime: dstartTime,
                openingFuel: openingFuel,
                secstartTime: dsecstartTime,
                secstartReading: secstartReading,
                secopeningFuel: secopeningFuel,
                fromLocation: fromLocation,
                toLocation: toLocation,
                OperatorId: operatorId,
                trans: transferTrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updatedispatch",
            };
            const response = await Pdispatch(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.navigate('ProductionMenu');
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
                requestIds: sAssetIds,
                ProductId: productId,
                supplyType: supplyType,
                type: "getProductdata",
            };
            const response = await Pdispatch(data);
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
        let index = tmptrans.findIndex(el => el.RequestId === argId);
        let dRQty = CommonFun.FloatVal(tmptrans[index]['RequestQty']);
        let dDQty = CommonFun.FloatVal(tmptrans[index]['DispatchQty']);
        if (CommonFun.FloatVal(dQty) > (dRQty - dDQty)) {
            alert("Qty greater than request Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setTransferTrans(tmptrans);
        return dQty;
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>Production CostCentre</Text>
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
            <View style={styles.row1.mtxttop}>
                {/* <View style={styles.Flatlistview}> */}
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Supply Type</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, height:45, paddingTop:10, paddingLeft:10}} pointerEvents={seldisabled}>
                            {Platform.OS == 'android' ? 
                                <Picker
                                    selectedValue={supplyType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue) => setSupplyType(itemValue)}
                                >
                                    <Picker.Item label="Internal" value="1" />
                                    <Picker.Item label="Sales" value="2" />
                                </Picker>
                                : <RNPickerSelect
                                    selectedValue={supplyType}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue) => setSupplyType(itemValue)}
                                    items={[
                                        { label: 'Internal', value: '1' },
                                        { label: 'Sales', value: '2' }
                                    ]}></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
                {/* </View> */}
            </View>
            <View style={supplyType == 2 ? styles.hide : styles.flatlist}>
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
            <View style={supplyType == 1 ? styles.hide : styles.flatlist}>
                <Text style={styles.labeltxt}>Client Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={clientModalVisible} data={clientData} onChange={clientHandleChange} onChangeSearch={onChangeSearchClient} search={clientSearch} actionOnCancel={setClientModalVisible} actionOnRow={actionOnRowClient} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setClientModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{pclientName ? pclientName : 'Select Client'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.row1.mtxttop}>
                {/* <View style={styles.Flatlistview}> */}
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Production Name</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%" ,height:45, paddingTop:10, paddingLeft:10 }} pointerEvents={seldisabled}>
                            {Platform.OS === 'android' ?
                                <Picker
                                    style={{ height: 50, width: '100%', borderWidth: 1, }}
                                    mode="dropdown"
                                    selectedValue={productId}
                                    onValueChange={(itemValue) => getRequestList(itemValue)}
                                >
                                    {productData.map((key) => {
                                        return (<Picker.Item label={key.Name} value={key.Id} key={key.Id} />)
                                    })}
                                </Picker>
                                : 
                                <RNPickerSelect
                                    selectedValue={productId}
                                    style={{ height: 50, width: '100%', borderwidth: 1 }}
                                    onValueChange={(itemValue) => getRequestList(itemValue)}

                                    items={productData.map((item) => {
                                        return ({ label: item.Name, value: item.Id, key: item.Id })

                                    })} ></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
                {/* </View> */}
            </View>
            <MPickList visible={assetModalVisible} data={assetData} onChange={assethandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetModalVisible} actionOnRow={actionOnRowAsset} />
        </View>
        
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={approve == 'Y' ? styles.hide : styles.inputContainer2}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickList visible={assetAddModalVisible} data={assetData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add Reference</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.Flatlistview}>
                <View style={styles.col3}>
                    <Text style={[styles.labeltxt, { marginTop: 10, }]} >Dispatch Qty</Text>
                </View>
                <View style={styles.colw25}>
                    <Text style={styles.itemtittle}>:</Text>
                </View>
                <View style={styles.col3}>
                    <TextInput
                        style={styles.input}
                        value={CommonFun.numberDigit(parseFloat(dispatchQty), 3)}
                        keyboardType="numeric"
                        maxLength={10}
                        editable={false}
                    />
                </View>
                <View style={styles.colw25}>
                    <Text style={styles.itemtittle}></Text>
                </View>
            </View>
            {/* <ScrollView> */}
            <View style={{ marginBottom: 50 }}>
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={transferTrans}
                    keyExtractor={item => item.RequestId}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemTitle2}> {item.RequestNo.slice(0, 15)}</Text>
                                </View>
                                <View style={approve == 'Y' ? styles.hide : styles.deleteicon}>
                                    <TouchableOpacity onPress={() => deleteRow(item.RequestId)}>
                                        {/* <Text style={styles.deletetext}>Delete</Text> */}
                                        <Icon name='delete' size={25} color='red' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.marg5}></View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Request Qty :</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}> {CommonFun.numberDigit(parseFloat(item.RequestQty), 3)}</Text>
                                </View>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty}>Dispatch Qty:</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}> {CommonFun.numberDigit(parseFloat(item.DispatchQty), 3)}</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Qty :</Text>
                                </View>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.Qty ? item.Qty.toString() : ""}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => checkQty(text, item.RequestId)}
                                        editable={approve == 'Y' ? false : true}
                                    />
                                </View>
                                <View style={styles.col3}>
                                    <Text style={styles.itemtittle} >{item.UnitName}</Text>
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
                <View style={[styles.row1, { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime}>Vechile Type</Text>
                    </View>
                    <View style={styles.col70}>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, }}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={vehicleType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue) => changeVehicleType(itemValue)}
                                >
                                    <Picker.Item label="Own" value="1" />
                                    <Picker.Item label="Hire" value="2" />
                                    <Picker.Item label="Service" value="3" />
                                    <Picker.Item label="Others" value="4" />
                                </Picker> :
                                <RNPickerSelect
                                    selectedValue={vehicleType}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue) => changeVehicleType(itemValue)}
                                    items={[
                                        { label: 'Own', value: '1' },
                                        { label: 'Hire', value: '2' },
                                        { label: 'Service', value: '3' },
                                        { label: 'Others', value: '4' }
                                    ]}></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <View style={vehicleType == 2 ? styles.row : styles.hide}>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Hire Order</Text>
                    </View>
                    <View style={styles.col70}>
                        <View style={styles.col70}>
                            <SPickList visible={hoModalVisible} data={hoData} onChange={hoHandleChange} onChangeSearch={onChangeSearchho} search={hoSearch} actionOnCancel={sethoModalVisible} actionOnRow={actionOnRowho} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => sethoModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{hoName ? hoName : 'Select Hire Order'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <View style={vehicleType == 3 ? styles.row : styles.hide}>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Service Order</Text>
                    </View>
                    <View style={styles.col70}>
                        <View style={styles.col70}>
                            <SPickList visible={soModalVisible} data={soData} onChange={soHandleChange} onChangeSearch={onChangeSearchso} search={soSearch} actionOnCancel={setsoModalVisible} actionOnRow={actionOnRowso} />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setsoModalVisible(true)}
                            >
                                <Text style={styles.textStyle}>{soName ? soName : 'Select Service Order'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <View style={vehicleType == 1 ? styles.row : styles.hide}>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Vechile Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <SPickList visible={vehicleModalVisible} data={vehicleData} onChange={vehicleHandleChange} onChangeSearch={onChangeSearchVehicle} search={vehicleSearch} actionOnCancel={setVehicleModalVisible} actionOnRow={actionOnRowVehicle} />
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => setVehicleModalVisible(true)}
                        >
                            <Text style={styles.textStyle}>{ovehicleName ? ovehicleName : 'Select Vehicle Name'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={vehicleType == 2 ? styles.row : styles.hide}>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Vechile Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <SPickList visible={hovehicleModalVisible} data={hovehicleData} onChange={hovehicleHandleChange} onChangeSearch={onChangeSearchVehicleho} search={hovehicleSearch} actionOnCancel={sethoVehicleModalVisible} actionOnRow={actionOnRowVehicleho} />
                        <Pressable
                            style={[styles.button, styles.buttonOpen]}
                            onPress={() => sethoVehicleModalVisible(true)}
                        >
                            <Text style={styles.textStyle}>{hovehicleName ? hovehicleName : 'Select Vehicle Name'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={vehicleType == 3 || vehicleType == 4 ? styles.row : styles.hide}>
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

            <View style={[styles.row1, { backgroundColor: '#fff', paddingBottom: 10, marginTop: 5, borderWidth: 1, borderColor: '#ced0d6', width: '98%', marginHorizontal: '1%' }]}>
                <View>
                    <Text style={[styles.coltime, { paddingLeft: 0, paddingTop: 2, color: 'grey' }]} >Primary Engine</Text>
                </View>
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
                                    borderColor: COLORS.brdleftblue,
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
                <View style={[styles.row1, { marginTop: 10, }]}>
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
                <View style={[styles.row1, { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Opening Fuel</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input}
                            value={openingFuel ? openingFuel.toString() : ''}
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={setOpeningFuel}
                            editable={approve == 'Y' ? false : true}
                        // editable={false}
                        />
                    </View>
                </View>
            </View>
            <View style={[(secAssetId == 0) ? styles.hide : styles.row1, { backgroundColor: '#fff', paddingBottom: 10, marginTop: 5, borderWidth: 1, borderColor: '#ced0d6', width: '98%', marginHorizontal: '1%' }]}>
                <View>
                    <Text style={[styles.coltime, { paddingLeft: 0, paddingTop: 2, color: 'grey' }]} >Secondary Engine</Text>
                </View>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Start Time</Text>
                    </View>
                    <View style={styles.col70}>
                        <DateTimePickerModal
                            isVisible={secshowFromTime}
                            mode="datetime"
                            is24Hour={true}
                            onConfirm={(date) => handleConfirmFromSec(date)}
                            onCancel={hideDatePickerFromSec}
                            date={secstartTime}
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
                                    borderColor: COLORS.brdleftblue,
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
                            onPress={() => setSecShowFromTime(true)}
                        >
                            <Text style={styles.textInput} > {Moment(secstartTime).format('DD-MM-yyyy hh:mm a')}</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={[styles.row1, { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Start Reading</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input}
                            value={secstartReading ? secstartReading.toString() : ''}
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={setSecStartReading}
                            editable={approve == 'Y' ? false : true}
                        />
                    </View>
                </View>
                <View style={[styles.row1, { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Opening Fuel</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input}
                            value={secopeningFuel ? secopeningFuel.toString(): ''}
                            keyboardType="numeric"
                            maxLength={10}
                            onChangeText={setSecOpeningFuel}
                            editable={approve == 'Y' ? false : true}
                        // editable={false}
                        />
                    </View>
                </View>
            </View>
            <View style={[styles.row1, { backgroundColor: '#fff', paddingBottom: 10, marginTop: 5, borderWidth: 1, borderColor: '#ced0d6', width: '98%', marginHorizontal: '1%' }]}>
                <View>
                    <Text style={[styles.coltime, { paddingLeft: 0, paddingTop: 2, color: "grey" }]} >Secondary Engine</Text>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, style = { marginTop: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Start Reading</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={startReading ? startReading.toString(): ''}
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
                            <Text style={styles.coltime} >Opening Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={openingFuel ? openingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={approve == 'Y' ? false : true}
                            // editable={false}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, { marginTop: 10, height: 40 }]}>
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
                <View style={[styles.row1, { marginTop: 3, marginBottom: 10, height: 40 }]}>
                    <View style={styles.col3}>
                        <Text style={[styles.collocation, { marginTop: 20, }]} >To Location</Text>
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
            <View style={[styles.row1, { marginTop: 25, marginBottom: 10, }]}>
                <View style={styles.col3}>
                    <Text style={[styles.collocation, { marginLeft: 0, }]} >Operator Name</Text>
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
                    justifyContent: "space-between", flexDirection: "row", backgroundColor: "#ffff",
                    borderBottomColor: "#dedede", borderBottomWidth: 1, marginTop: 2, marginBottom: 2
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
export default PDispatchEntry;
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
        borderLeftColor: COLORS.brdleftblue,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderTopColor: '#cad4e8',
        borderRightColor: '#cad4e8',
        borderBottomColor: '#cad4e8',
        fontSize: 24,
        fontWeight: 'bold',
        // shadowColor: "#000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.29,
        // shadowRadius: 4.65,
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
    Flatlistview: {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 5,
    },
    Flatlistview1: {
        margin: 0,
        flexDirection: 'row',
        width: '100%',
        alignContent: 'space-between',
        padding: 0,
    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
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
        //backgroundColor: '#040485',
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        // marginLeft: '65%',
        maxWidth: '60%',
        alignItems: "center",
        justifyContent: "center",
    },
    itemtittle: {
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
        // shadowColor: "#000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        PaddingBottom: 10,
    },
    Flatlistview1: {
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
    nextContainer: {
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
    row: {
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        // shadowColor: "#000",
        // shadowOpacity: 0.8,
        // shadowRadius: 2,
        backgroundColor: '#fff',
        PaddingBottom: 10,
    },
    btnContainerprenxt: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
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
    colon: {
        paddingTop: 10,
    },
    itemtittle: {
        paddingTop: 10,
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
        color: '#022969'
    },
    availableQty: {
        paddingTop: 10,
        color: '#02691a',
        fontWeight: 'bold',
    },
    enterQty: {
        paddingTop: 10,
        color: '#067a96',
        fontWeight: 'bold',
    },
    deletetext: {
        color: '#fff',
        textAlign: 'center',
    },
    deleteicon: {
        backgroundColor: '#fff',
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        width: '18%',
    },
    marg5: {
        margin: 2,
    },
    textStyle: {
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
    col70: {
        width: '70%',
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

})