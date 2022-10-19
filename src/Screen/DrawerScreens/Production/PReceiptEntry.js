import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';;
import { ToastAndroid } from 'react-native';
import Icon from 'react-native-elements/dist/icons/Icon';
import { Preceipt } from '../../../service/api/apiservice';
import Wizard from "react-native-wizard"
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import GeoPickList from '../../Components/geoPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import MPickList from '../../Components/mPickList';
import { ScrollView } from 'react-native-gesture-handler';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const PReceiptEntry = (props) => {

     console.log('<<<<<<<<<<<<chinna>>>>>>>>>>>>>');
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
    const [approve, setApprove] = useState('N');

    const [clientListItems, setClientListItems] = useState([]);
    const [cllientData, setClientData] = useState([]);
    const [clientSearch, setClientSearch] = useState('');

    const [tccListItems, setTCCListItems] = useState([]);
    const [tccData, setTCCData] = useState([]);
    const [tccSearch, setTCCSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [pclientId, setPclientId] = useState(0);
    const [pclientName, setPclientName] = useState('');

    const [tccId, setTCCId] = useState(0);
    const [tccName, setTCCName] = useState('');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [tccModalVisible, setTCCModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);

    const [supplyType, setSupplyType] = useState(1);
    const [transferTrans, setTransferTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');
    const [selreceiptdisabled, setselreceiptdisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [submitClick, setsubmitClick] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [totalTime, setTotalTime] = useState('');

    const [secAssetId, setSecAssetId] = useState(0);
    const [secstartTime, setSecStartTime] = useState(new Date());
    const [secendTime, setSecEndTime] = useState(new Date());
    const [sectotalTime, setSecTotalTime] = useState('');

    const [totDays, setTotDays] = useState(0);
    const [totHrs, setTotHrs] = useState(0);
    const [totMinutes, setTotMinutes] = useState(0);

    const [sectotDays, setSecTotDays] = useState(0);
    const [sectotHrs, setSecTotHrs] = useState(0);
    const [sectotMinutes, setSecTotMinutes] = useState(0);


    const [startReading, setStartReading] = useState('0');
    const [endReading, setEndReading] = useState('0');
    const [totalReading, setTotalReading] = useState('0');

    const [secstartReading, setSecStartReading] = useState('0');
    const [secendReading, setSecEndReading] = useState('0');
    const [sectotalReading, setSecTotalReading] = useState('0');

    const [vehicleNo, setvehicleNo] = useState('');
    const [vehicleName, setvehicleName] = useState('');

    const [openingFuel, setOpeningFuel] = useState(0);
    const [closingFuel, setClosingFuel] = useState(0);

    const [secopeningFuel, setSecOpeningFuel] = useState(0);
    const [secclosingFuel, setSecClosingFuel] = useState(0);

    const [autoIssue, setAutoIssue] = useState(0);
    const [issueTo, setIssueTo] = useState(1);
    const [issueType, setIssueType] = useState(1);
    const [vendorId, setVendorId] = useState(0);
    const [vendorName, setVendorName] = useState('');

    const [vendorListItems, setVendorListItems] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [vendorSearch, setVendorSearch] = useState('');

    const [vendorModalVisible, setVendorModalVisible] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState(0);
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [showFromTime, setShowFromTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const [secshowFromTime, setSecShowFromTime] = useState(false);
    const [secshowEndTime, setSecShowEndTime] = useState(false);


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
    const [workdoneTrans, setWorkdoneTrans] = useState([]);
    const [wbs, setWBS] = useState(0);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);

    useEffect(() => {
        if (ccData.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (ccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId]);
    useEffect(() => {
        if (transferTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [transferTrans]);
    useEffect(() => {
        calCulateTotalTime(startTime, endTime);
    }, [startTime, endTime]);
    useEffect(() => {
        calCulateTotalTimeSec(secstartTime, secendTime);
    }, [secstartTime, secendTime]);
    useEffect(() => {
        calCulateTotalTimeSec(secstartTime, secendTime);
    }, [secstartTime, secendTime]);

    useEffect(() => {
        removeAssetData();
        calculateWorkDoneQty();
    }, [workdoneTrans]);
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
                    type: 'geteditdata'
                };
                const response = await Preceipt(data);
                const datas = await response.json();
                const RegData = datas.regList;
                const requestData = datas.requestList;
                const vTrans = datas.vehicleTransList;
                const pTrans = datas.ptransList;

                setCCId(RegData.CostCentreId);
                setCCName(RegData.CostCentreName);
                if (RegData.TransType == 'S') setSupplyType(2);
                else setSupplyType(1);
                setPclientId(RegData.ClientId);
                setPclientName(RegData.ClientName);
                setTCCId(requestData.Id);
                setTCCName(requestData.Name)
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                setTransferTrans(datas.transList);
                setVendorData(datas.vendorList);
                setVendorListItems(datas.vendorList);
                setOrderData(datas.orderList);

                setAssetData(datas.iowlist);
                setAssetListItems(datas.iowlist);
                setMAssetData(datas.iowlist);
                setWorkdoneTrans(datas.workdone);
                setWBS(datas.wbs);

                if (pTrans) {
                    setAutoIssue(pTrans.AutoIssueRequired);
                    setVendorId(pTrans.VendorId);
                    setVendorName(pTrans.VendorName);
                    setOrderId(pTrans.WORegisterId);
                    if (pTrans.IssueType == 'C') setIssueTo(2);
                    else setIssueTo(1);
                    if (pTrans.SIssueType == 'C') setIssueType(2);
                    else setIssueType(1);
                }
                if (vTrans) {
                    setvehicleName(vTrans.VehicleName);
                    setvehicleNo(vTrans.VehicleNo);
                    setOpeningFuel(vTrans.OpeningFuel);
                    setClosingFuel(vTrans.ClosingFuel);
                    setStartTime(new Date(vTrans.StartTime));
                    setEndTime(new Date(vTrans.EndTime));
                    setTotDays(vTrans.TotalDays);
                    setTotHrs(vTrans.TotalHrs);
                    setTotMinutes(vTrans.TotalMinutes);
                    setStartReading(vTrans.StartReading);
                    setEndReading(vTrans.EndReading);
                    setFromLocation(vTrans.FromLocation);
                    setToLocation(vTrans.ToLocation);
                    setOperatorId(vTrans.OperatorId);
                    setOperatorName(vTrans.OperatorName);
                    setSecAssetId(vTrans.SecAssetId);
                    setSecOpeningFuel(vTrans.SecOpeningFuel);
                    setSecClosingFuel(vTrans.SecClosingFuel);
                    setSecStartTime(new Date(vTrans.SecStartTime));
                    setSecEndTime(new Date(vTrans.SecEndTime));
                    setSecTotDays(vTrans.SecTotalDays);
                    setSecTotHrs(vTrans.SecTotalHrs);
                    setSecTotMinutes(vTrans.SecTotalMinutes);
                    setSecStartReading(vTrans.SecStartReading);
                    setSecEndReading(vTrans.SecEndReading);
                }
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getentryData",
                };
                const response = await Preceipt(data)
                const datas = await response.json();
                setCCData(datas.ccList);
                setCCListItems(datas.ccList);
                setClientData(datas.clientList);
                setClientListItems(datas.clientList);
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
                setToLocation(json.results[0].formatted_address);
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
    const onChangeSearchVendor = (query) => {
        try {
            if (query) {
                const newData = vendorListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setVendorData(newData);
                setVendorSearch(query);
            } else {
                setVendorData(vendorListItems);
                setVendorSearch(query);
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
    const actionOnRowCC = async (item) => {
        setCCName(item.Name);
        setCCModalVisible(false);
        var iCostcentreId = item.Id;
        setCCId(iCostcentreId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getDispatchInternal'
        };
        const response = await Preceipt(data)
        var datas = await response.json();
        setTCCData(datas.dispatchList);
        setTCCListItems(datas.dispatchList);
        setVendorData(datas.vendorList);
        setVendorListItems(datas.vendorList);
    }
    const actionOnRowClient = async (item) => {
        setPclientName(item.Name);
        setClientModalVisible(false);
        var iClientId = item.Id;
        setPclientId(iClientId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            PClientId: iClientId,
            type: 'getDispatchSales'
        };
        const response = await Preceipt(data)
        var datas = await response.json();
        setTCCData(datas);
        setTCCListItems(datas);
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
    const getAsset = async (sAssetIds) => {
        try {
            if (sAssetIds == '') return;
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                iowIds: sAssetIds,
                wbs: wbs,
                type: "getWorkDoneData",
            };
            const response = await Preceipt(data);
            const datas = await response.json();
            let tempTrans = [...workdoneTrans];
            tempTrans.push(...datas);
            setWorkdoneTrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
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
    const actionOnRowVendor = async (item) => {
        setVendorName(item.Name);
        setVendorModalVisible(false);
        var iVendorId = item.Id;
        setVendorId(iVendorId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: ccId,
            VendorId: iVendorId,
            type: 'getOrder'
        };
        const response = await Preceipt(data)
        var dataa = await response.json();
        setOrderData(dataa);
    }
    const actionOnRowTCC = async (item) => {
        setTCCName(item.Name);
        setTCCModalVisible(false);
        var iregisterId = item.Id;
        setTCCId(iregisterId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            registerId: iregisterId,
            type: 'getDispatchData'
        };
        const response = await Preceipt(data)
        var datas = await response.json();
        setTransferTrans(datas.regList);
        const vTrans = datas.vehicleTransList;

        setAssetData(datas.iowList);
        setAssetListItems(datas.iowList);
        setMAssetData(datas.iowList);
        setWBS(datas.wbs);
        if (vTrans) {
            setvehicleName(vTrans.VehicleName);
            setvehicleNo(vTrans.VehicleNo);
            setOpeningFuel(vTrans.OpeningFuel);
            setStartTime(new Date(vTrans.StartTime));
            setStartReading(vTrans.StartReading);
            setFromLocation(vTrans.FromLocation);
            setToLocation(vTrans.ToLocation);
            setOperatorId(vTrans.OperatorId);
            setOperatorName(vTrans.OperatorName);
            setSecAssetId(vTrans.SecAssetId);
            setSecOpeningFuel(vTrans.SecOpeningFuel);
            setSecStartTime(new Date(vTrans.SecStartTime));
            setSecStartReading(vTrans.SecStartReading);
        }
    }
    function removeAssetData() {
        if (workdoneTrans.length > 0) {
            let tmptrans = [...assetListItems];
            workdoneTrans.map((userData) => {
                let iAssetId = userData.Id;
                let index = tmptrans.findIndex(el => el.Id === iAssetId);
                if (index !== -1) tmptrans.splice(index, 1);
            });
            setAssetData(tmptrans);
            setAssetListItems(tmptrans);
        };
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
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setWorkdoneTrans(tmptrans);
        }
    }
    function updateWorkDoneQty(argValue, argId) {
        let dQty = argValue;
        let dispatchQty = 0;
        transferTrans.map((userData) => {
            dispatchQty = dispatchQty + CommonFun.FloatVal(userData.DispatchQty);
        });
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);

        let doneQty = 0;
        workdoneTrans.map((userData) => {
            if (userData.Id != argId) {
                doneQty = doneQty + CommonFun.FloatVal(userData.Qty);
            }
        });
        let totDoneQty = CommonFun.FloatVal(dQty) + doneQty;
        if (totDoneQty > dispatchQty) {
            alert("Qty greater than dispatch Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setWorkdoneTrans(tmptrans);
        return dQty;
    }
    function calculateWorkDoneQty() {
        if (workdoneTrans.length > 0) {
            let doneQty = 0;
            workdoneTrans.map((userData) => {
                doneQty = doneQty + CommonFun.FloatVal(userData.Qty);
            });
            let iTransId = 0;
            transferTrans.map((userData) => {
                iTransId = userData.TransId;
            });
            let tmptrans = [...transferTrans];
            let index = tmptrans.findIndex(el => el.TransId === iTransId);
            if (index != -1) tmptrans[index] = { ...tmptrans[index], Qty: doneQty };
            setTransferTrans(tmptrans);
            setselreceiptdisabled('none');
        } else {
            setselreceiptdisabled('auto');
        }
    }
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    function clientHandleChange() {
        setClientModalVisible(false)
    }
    function tccHandleChange() {
        setTCCModalVisible(false)
    }
    function vendorhandleChange() {
        setVendorModalVisible(false)
    }
    function handleConfirmFrom(argValue) {
        setStartTime(argValue);
        setShowFromTime(false);
    }
    function handleConfirmEnd(argValue) {
        if (new Date(startTime) > new Date(argValue)) {
            alert("End Time less than Start Time");
            setShowEndTime(false);
        } else {
            setEndTime(argValue);
            setShowEndTime(false);
            calCulateTotalTime(startTime, argValue);
        }
    }


    function handleConfirmFromSec(argValue) {
        setSecStartTime(argValue);
        setSecShowFromTime(false);
    }
    function handleConfirmEnd(argValue) {
        if (new Date(startTime) > new Date(argValue)) {
            alert("End Time less than Start Time");
            setShowEndTime(false);
        } else {
            setEndTime(argValue);
            setShowEndTime(false);
            calCulateTotalTime(startTime, argValue);
        }
    }


    function calCulateTotalTime(argFDate, argTDate) {
        //console.log(new Date(argFDate), new Date(agrTDate));
        let dFDate = new Date(argFDate);
        let dTDate = new Date(argTDate);
        var delta = Math.abs(dTDate - dFDate) / 1000;

        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        var seconds = delta % 60;

        setTotDays(days);
        setTotHrs(hours);
        setTotMinutes(minutes);
    }


    function calCulateTotalTimeSec(argFDate, argTDate) {
        //console.log(new Date(argFDate), new Date(agrTDate));
        let dFDate = new Date(argFDate);
        let dTDate = new Date(argTDate);
        var delta = Math.abs(dTDate - dFDate) / 1000;

        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        var seconds = delta % 60;

        setSecTotDays(days);
        setSecTotHrs(hours);
        setSecTotMinutes(minutes);
    }

    function hideDatePickerFrom() {
        setShowFromTime(false);
    }
    function hideDatePickerEnd() {
        setShowEndTime(false);
    }

    function hideDatePickerFromSec() {
        setSecShowFromTime(false);
    }
    function hideDatePickerEndSec() {
        setSecShowEndTime(false);
    }
    function actionOnFromLocation(item) {
        setFromLocation(item);
        setgeoFromModalVisible(false);
    }
    function actionOnToLocation(item) {
        setToLocation(item);
        setgeoToModalVisible(false);
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
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
    function updateClosingFuel(argValue) {
        let dFuel = argValue;
        let dOpen = openingFuel;
        if (CommonFun.FloatVal(dOpen) < CommonFun.FloatVal(dFuel)) {
            alert("Closing Fuel greater than End Fuel");
            dFuel = dOpen;
            return;
        }
        setClosingFuel(dFuel);
    }
    function updateClosingFuelSec(argValue) {
        let dFuel = argValue;
        let dOpen = secopeningFuel;
        if (CommonFun.FloatVal(dOpen) < CommonFun.FloatVal(dFuel)) {
            alert("Closing Fuel greater than End Fuel");
            dFuel = dOpen;
            return;
        }
        setSecClosingFuel(dFuel);
    }
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (ccId == 0) {
            setsubmitClick(false);
            alert("Select Costcentre");
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
    const updateData = async () => {
        let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
        let dendTime = Moment(endTime).format('YYYY-MMM-DD HH:mm:ss');
        let dsecstartTime = Moment(secstartTime).format('YYYY-MMM-DD HH:mm:ss');
        let dsecendTime = Moment(secendTime).format('YYYY-MMM-DD HH:mm:ss');
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                dispatchId: tccId,
                trans: transferTrans,
                workdoneTrans: workdoneTrans,
                startReading: startReading,
                endReading: endReading,
                startTime: dstartTime,
                endTime: dendTime,
                TotDays: totDays,
                TotHours: totHrs,
                TotMinutes: totMinutes,
                openingFuel: openingFuel,
                closingFuel: closingFuel,
                secstartReading: secstartReading,
                secendReading: secendReading,
                secstartTime: dsecstartTime,
                secendTime: dsecendTime,
                secTotDays: sectotDays,
                secTotHours: sectotHrs,
                secTotMinutes: sectotMinutes,
                secopeningFuel: secopeningFuel,
                secclosingFuel: secclosingFuel,
                fromLocation: fromLocation,
                toLocation: toLocation,
                OperatorId: operatorId,
                autoIssue: autoIssue,
                issueTo: issueTo,
                issueType: issueType,
                vendorId: vendorId,
                orderId: orderId,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updateReceipt",
            };
            const response = await Preceipt(data);
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
    function checkQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...transferTrans];
        let index = tmptrans.findIndex(el => el.TransId === argId);
        let dAQty = CommonFun.FloatVal(tmptrans[index]['DispatchQty']);
        if (CommonFun.FloatVal(dQty) > dAQty) {
            alert("Qty greater than dispatch Qty");
            dQty = 0;
        }
        if (index !== -1) tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setTransferTrans(tmptrans);
        return dQty;
    }
    function goNext() {
        if (currentStep == 0) {
            if (ccId == 0) {
                alert("Select CostCentre");
                return;
            }
            if (tccId == 0) {
                alert("Select Dispatch Reference");
                return;
            }
            wizard.current.next();
        } else {
            wizard.current.next();
        }
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Supply Type</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue,height:45, paddingTop:10, paddingLeft:10 }} pointerEvents={seldisabled}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={supplyType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setSupplyType(itemValue)}
                                >
                                    <Picker.Item label="Internal" value="1" />
                                    <Picker.Item label="Sales" value="2" />
                                </Picker> :
                                <RNPickerSelect
                                    selectedValue={supplyType}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setSupplyType(itemValue)}
                                    items={[
                                        { label: 'Internal', value: '1' },
                                        { label: 'Sales', value: '2' }
                                    ]}></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <View style={supplyType == 1 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>CostCentre</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={ccModalVisible} data={ccData} onChange={ccHandleChange} onChangeSearch={onChangeSearchCC} search={ccSearch} actionOnCancel={setCCModalVisible} actionOnRow={actionOnRowCC} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setCCModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{ccName ? ccName : 'Select CostCentre'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={supplyType == 2 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>Client</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={clientModalVisible} data={cllientData} onChange={clientHandleChange} onChangeSearch={onChangeSearchClient} search={clientSearch} actionOnCancel={setClientModalVisible} actionOnRow={actionOnRowClient} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setClientModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{pclientName ? pclientName : 'Select Client'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.mtxttop}>
                <Text style={styles.labeltxt}>Dispath Reference</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={tccModalVisible} data={tccData} onChange={tccHandleChange} onChangeSearch={onChangeSearchTCC} search={tccSearch} actionOnCancel={setTCCModalVisible} actionOnRow={actionOnRowTCC} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setTCCModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{tccName ? tccName : 'Select Dispath Reference'}</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={{ marginBottom: 50 }}>
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={transferTrans}
                    keyExtractor={item => item.TransId}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemTitle2}> {item.RefNo}</Text>
                                </View>
                            </View>
                            <View style={styles.marg5}></View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Despatch Qty :</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}> {CommonFun.numberDigit(parseFloat(item.DispatchQty), 3)}</Text>
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.enterQty}>Receipt Qty:</Text>
                                </View>
                                <View style={styles.col3} pointerEvents={selreceiptdisabled}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.Qty ? item.Qty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => checkQty(text, item.TransId)}
                                        editable={approve == 'Y' ? false : true}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        </View>
                    }}
                />
            </View>
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Auto Issue Required</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue,height:50, paddingTop:15, paddingLeft:10}}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={autoIssue}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setAutoIssue(itemValue)}
                                >
                                    <Picker.Item label="No" value="0" />
                                    <Picker.Item label="Yes" value="1" />
                                </Picker>
                                :
                                <RNPickerSelect
                                    selectedValue={autoIssue}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setAutoIssue(itemValue)}
                                    items={[
                                        { label: 'No', value: '1' },
                                        { label: 'Yes', value: '2' }
                                    ]}></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Issue To</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue,height:50, paddingTop:15, paddingLeft:10 }}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={issueTo ? issueTo.toString() : ''}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setIssueTo(itemValue)}
                                >
                                    <Picker.Item label="Internal" value="1" />
                                    <Picker.Item label="Contractor" value="2" />
                                </Picker>
                                :
                                <RNPickerSelect
                                    selectedValue={issueTo ? issueTo.toString() : ''}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setIssueTo(itemValue)}
                                    items={[
                                        { label: 'Internal', value: '1' },
                                        { label: 'Contractor', value: '2' }
                                    ]}></RNPickerSelect>}

                        </View>
                    </View>
                </View>
            </View>
            <View style={issueTo == 2 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>Vendor Name</Text>
                <View style={styles.centeredView}>
                    <SPickList visible={vendorModalVisible} data={vendorData} onChange={vendorhandleChange} onChangeSearch={onChangeSearchVendor} search={vendorSearch} actionOnCancel={setVendorModalVisible} actionOnRow={actionOnRowVendor} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setVendorModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{vendorName ? vendorName : 'Select Vendor Name'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={issueTo == 2 ? styles.row1.mtxttop : styles.hide}>
                <View style={{ width: '95%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <Text style={styles.labeltxt}>Order No</Text>
                    <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%",height:50, paddingTop:15, paddingLeft:10 }}>
                        {Platform.OS == 'android' ?
                            <Picker
                                style={{ height: 50, width: '100%', borderWidth: 1, }}
                                mode="dropdown"
                                selectedValue={orderId}
                                onValueChange={(itemValue, itemIndex) => setOrderId(itemValue)}
                            >
                                {orderData.map((key) => {
                                    return (<Picker.Item label={key.OrderNo} value={key.OrderId} key={key.OrderId} />)
                                })}
                            </Picker>
                            : <RNPickerSelect
                                selectedValue={orderId}
                                style={{ height: 50, width: '100%', borderwidth: 1 }}
                                onValueChange={(itemValue, itemIndex) => setOrderId(itemValue)}
                                items={orderData.map((item) => {
                                    return ({ label: item.OrderNo, value: item.OrderId, key: item.OrderId })
                                })}></RNPickerSelect>
                        }

                    </View>
                </View>
            </View>
            <View style={issueTo == 2 ? styles.row1.mtxttop : styles.hide}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Issue Type</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, height:50, paddingTop:15, paddingLeft:10}}>
                            {Platform.OS == 'android' ?
                                <Picker
                                    selectedValue={issueType}
                                    style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setIssueType(itemValue)}
                                >
                                    <Picker.Item label="Free" value="1" />
                                    <Picker.Item label="Chargeable" value="2" />
                                </Picker> :
                                <RNPickerSelect
                                    selectedValue={issueType}
                                    style={{ height: 50, width: '100%', borderwidth: 1, padding: 0 }}
                                    onValueChange={(itemValue, itemIndex) => setIssueType(itemValue)}
                                    items={[
                                        { label: 'Free', value: '1' },
                                        { label: 'Chargeable', value: '2' }
                                    ]}></RNPickerSelect>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%', backgroundColor: '#fff' }} >
            {/* <ScrollView> */}
            <View style={styles.row}>
                <View style={[styles.row1, { marginTop: 10 }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Vehicle Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input1}
                            value={vehicleName}
                            maxLength={50}
                            onChangeText={setvehicleName}
                            editable={false}
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
                            style={styles.input1}
                            value={vehicleNo}
                            maxLength={50}
                            onChangeText={setvehicleNo}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
            <View style={[styles.row1, { backgroundColor: '#fff', paddingBottom: 10, marginTop: 5, borderWidth: 1, borderColor: '#ced0d6', width: '98%', marginHorizontal: '1%' }]}>
                <View>
                    <Text style={[styles.coltimeleft, { paddingLeft: 8, paddingTop: 2, }]} >Primary Engine</Text>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { backgroundColor: '#fff', margin: 0, borderRadius: 5, }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Start Time</Text>
                            <DateTimePickerModal
                                isVisible={showFromTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmFrom(date)}
                                onCancel={hideDatePickerFrom}
                                date={startTime}
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
                                        paddingTop: 1,
                                        paddingHorizontal: 0,

                                    },
                                }}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setShowFromTime(false)}
                            >
                                <Text style={styles.textInput} > {Moment(startTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >End Time</Text>
                            <DateTimePickerModal
                                isVisible={showEndTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmEnd(date)}
                                onCancel={hideDatePickerEnd}
                                date={endTime}
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
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 1 }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Start Reading</Text>
                            <TextInput
                                style={styles.input}
                                value={startReading  ? startReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={setStartReading}
                                editable={false}
                            />
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >End Reading</Text>
                            <TextInput
                                style={styles.input}
                                value={endReading ? endReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={setEndReading}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
                <View style={[styles.row]}>
                    <View style={[styles.row1, { backgroundColor: '#fff', margin: 0, borderRadius: 5, }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Opening Fuel</Text>
                            <TextInput
                                style={styles.input}
                                value={openingFuel ? openingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Closing Fuel</Text>
                            <TextInput
                                style={styles.input}
                                value={closingFuel ? closingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateClosingFuel(text)}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={[(secAssetId == 0) ? styles.hide : styles.row1, { backgroundColor: '#fff', paddingBottom: 10, marginTop: 5, borderWidth: 1, borderColor: '#ced0d6', width: '98%', marginHorizontal: '1%' }]}>
                <View>
                    <Text style={[styles.coltimeleft, { paddingLeft: 8, paddingTop: 2, }]} >Secondary Engine</Text>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { backgroundColor: '#fff', margin: 0, borderRadius: 5, }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Start Time</Text>
                            <DateTimePickerModal
                                isVisible={secshowFromTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmFromSec(date)}
                                onCancel={hideDatePickerFromSec}
                                date={secstartTime}
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
                                onPress={() => setSecShowFromTime(false)}
                            >
                                <Text style={styles.textInput} > {Moment(secstartTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >End Time</Text>
                            <DateTimePickerModal
                                isVisible={secshowEndTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmEndSec(date)}
                                onCancel={hideDatePickerEndSec}
                                date={secendTime}
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
                                        height: 50,
                                        alignItems: 'flex-start',
                                        paddingTop: 15,
                                        paddingLeft: 10,
                                    },
                                }}
                            />
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setSecShowEndTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(secendTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.row1, { marginTop: 1 }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Start Reading</Text>
                            <TextInput
                                style={styles.input}
                                value={secstartReading ? secstartReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={setSecStartReading}
                                editable={false}
                            />
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >End Reading</Text>
                            <TextInput
                                style={styles.input}
                                value={secendReading ? secendReading.toString() : ''} 
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={setSecEndReading}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
                <View style={[styles.row]}>
                    <View style={[styles.row1, { backgroundColor: '#fff', margin: 2, borderRadius: 5, marginLeft: 3 }]}>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Opening Fuel</Text>
                            <TextInput
                                style={styles.input}
                                value={secopeningFuel ? secopeningFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.col48}>
                            <Text style={styles.coltimeleft} >Closing Fuel</Text>
                            <TextInput
                                style={styles.input}
                                value={secclosingFuel  ? secclosingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateClosingFuelSec(text)}
                                editable={approve == 'Y' ? false : true}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, { backgroundColor: '#fff', margin: 2, borderRadius: 5, marginLeft: 3 }]}>
                    <View style={[styles.row1, { marginTop: 10, height: 40 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.collocation} >From Location</Text>
                        </View>
                        <View style={styles.col70}>
                            <Pressable
                                onPress={() => setgeoFromModalVisible(true)}>
                                <Text style={styles.Locationinput}>{fromLocation ? fromLocation : 'Select From Location'}
                                    <GeoPickList styles={{ height: 1, width: 1 }} visible={geoFromModalVisible} data={fromLocation} actionOnCancel={setgeoFromModalVisible} actionOnRow={actionOnFromLocation} />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 20, marginBottom: 10, height: 40 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.collocation} >To Location</Text>
                        </View>
                        <View style={styles.col70}>
                            <Pressable
                                onPress={() => setgeoToModalVisible(true)}>
                                <Text style={styles.Locationinput}>{toLocation ? toLocation : 'Select To Location'}
                                    <GeoPickList styles={{ height: 1, width: 1 }} visible={geoToModalVisible} data={toLocation} actionOnCancel={setgeoToModalVisible} actionOnRow={actionOnToLocation} />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, { marginTop: 10, marginBottom: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Operator Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input1}
                            value={operatorName}
                            maxLength={50}
                            onChangeText={setOperatorName}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
            {/* </ScrollView> */}
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={approve == 'Y' ? styles.hide : styles.inputContainer2}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickList visible={assetAddModalVisible} data={assetData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add WorkDone</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <ScrollView> */}
            <View style={{ marginBottom: 50 }}>
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={workdoneTrans}
                    keyExtractor={item => item.Id}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemTitle2}> {item.Specification}</Text>
                                </View>
                                <View style={approve == 'Y' ? styles.hide : styles.deleteicon}>
                                    <TouchableOpacity onPress={() => deleteRow(item.Id)}>
                                        <Icon name='delete' size={25} color='red' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col10}>
                                    <Text style={styles.itemTitle2}> {item.WBSName}</Text>
                                </View>
                            </View>
                            <View style={styles.marg5}></View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Work Done Qty</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.Qty ? item.Qty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => updateWorkDoneQty(text, item.Id)}
                                        editable={approve == 'Y' ? false : true}
                                    />
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.unit} >{item.UnitName}</Text>
                                </View>
                                <View style={styles.col2}>
                                </View>
                            </View>
                        </TouchableOpacity>
                        </View>
                    }}
                />
            </View>
            {/* </ScrollView> */}
            <View style={styles.flatlist}>
                <Text style={[styles.labeltxt,
                { paddingLeft: 5, }]}>Remarks</Text>
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
export default PReceiptEntry;
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
        marginLeft: 5,
    },
    button: {
        // borderRadius: 20,
        padding: 15,
        // elevation: 2,
        backgroundColor: 'transparent',
        borderWidth: 1,
        // bordercolor:'black'

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
        width: '100%',
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
    itemtittle: {
        color: '#646569',
        textAlign: 'left',
        padding: 2,
        // minWidth: 100,
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
        // backgroundC0olor: 'red',

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
        height: 45,
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
        backgroundColor: 'transparent',
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        width: '18%',
    },
    marg5: {
        margin: 2,
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
    col48: {
        width: '46.5%',
        marginLeft: '2.5%'
    },
    coltime: {
        paddingTop: 10,
        marginLeft: 10,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    input1: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        color: 'black'
    },
    textInput: {
        color: 'black'
    },
    coltimeleft: {
        paddingTop: 10,
        marginLeft: 2,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    collocation: {
        paddingTop: 10,
        marginLeft: 10,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
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

    col10: {
        width: '98%',
    },
})