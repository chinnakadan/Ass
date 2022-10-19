import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, SafeAreaView, TextInput, BackHandler, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Stock, Usage } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import Moment from 'moment';
import SPickList from '../../Components/sPickList';
import MPickList from '../../Components/mPickList';
import Wizard from "react-native-wizard"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GeoPickList from '../../Components/geoPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AddOperator from '../../Components/AddOperator';
import { convert } from 'react-native-html-to-pdf';
import CommonFun from '../../Components/CommonFun';
import RNPickerSelect from 'react-native-picker-select';

const UsageEntry = (props) => {
    const { RegisterId } = props.route.params;
    const wizard = useRef()
    const [isFirstStep, setIsFirstStep] = useState(true)
    const [isLastStep, setIsLastStep] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    // const ref = useRef();
    const [ccListItems, setCCListItems] = useState([]);
    const [ccData, setCCData] = useState([]);
    const [ccSearch, setCCSearch] = useState('');
    const [selectedAsset, setselectedAsset] = useState([]);
    const [approve, setApprove] = useState('N');

    const [oassetListItems, setOassetListItems] = useState([]);
    const [oassetData, setOassetData] = useState([]);
    const [oassetSearch, setOassetSearch] = useState('');

    const [operatorListItems, setOperatorListItems] = useState([]);
    const [operatorData, setOperatorData] = useState([]);
    const [operatorSearch, setOperatorSearch] = useState('');

    const [hassetListItems, setHassetListItems] = useState([]);
    const [hassetData, setHassetData] = useState([]);
    const [hassetSearch, setHassetSearch] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [totalTime, setTotalTime] = useState('');

    const [secstartTime, setSecStartTime] = useState(new Date());
    const [secendTime, setSecEndTime] = useState(new Date());
    const [sectotalTime, setSecTotalTime] = useState('');

    const [secAssetId, setSecAssetId] = useState(0);

    const [usageQty, setUsageQty] = useState(0);
    const [startReading, setStartReading] = useState(0);
    const [endReading, setEndReading] = useState(0);
    const [totalReading, setTotalReading] = useState(0);

    const [secstartReading, setSecStartReading] = useState(0);
    const [secendReading, setSecEndReading] = useState(0);
    const [sectotalReading, setSecTotalReading] = useState(0);

    const [openingFuel, setOpeningFuel] = useState(0);
    const [closingFuel, setClosingFuel] = useState(0);

    const [secopeningFuel, setSecOpeningFuel] = useState(0);
    const [secclosingFuel, setSecClosingFuel] = useState(0);

    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [vendorListItems, setVendorListItems] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [vendorSearch, setVendorSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [oassetId, setOassetId] = useState(0);
    const [oassetName, setOassetName] = useState('');

    const [operatorId, setOperatorId] = useState(0);
    const [operatorName, setOperatorName] = useState('');

    const [hassetId, setHassetId] = useState(0);
    const [hassetName, setHassetName] = useState('');

    const [vendorId, setVendorId] = useState(0);
    const [vendorName, setVendorName] = useState('');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [oassetModalVisible, setOassetModalVisible] = useState(false);
    const [operatorModalVisible, setOperatorModalVisible] = useState(false);
    const [hassetModalVisible, setHassetModalVisible] = useState(false);
    const [vendorModalVisible, setVendorModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);
    const [geoFromModalVisible, setgeoFromModalVisible] = useState(false);
    const [geoToModalVisible, setgeoToModalVisible] = useState(false);

    const [orderData, setOrderData] = useState([]);
    const [orderId, setOrderId] = useState(0);

    const [assetType, setAssetType] = useState(1);
    const [workdoneTrans, setWorkdoneTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [screenshow, setscreenshow] = useState(0);
    const [nextShow, setNextShow] = React.useState(0);
    const [submitClick, setsubmitClick] = useState(false);
    const [trackType, setTrackType] = useState('I');
    const [stockQty, setStockQty] = useState(0);
    const [totDays, setTotDays] = useState(0);
    const [totHrs, setTotHrs] = useState(0);
    const [totMinutes, setTotMinutes] = useState(0);
    const [sectotDays, setSecTotDays] = useState(0);
    const [sectotHrs, setSecTotHrs] = useState(0);
    const [sectotMinutes, setSecTotMinutes] = useState(0);

    const [unitName, setUnitName] = useState('');
    const [usageType, setUsageType] = useState('U');
    const [wbs, setWBS] = useState(0);
    const [showFromTime, setShowFromTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [secshowFromTime, setSecShowFromTime] = useState(false);
    const [secshowEndTime, setSecShowEndTime] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (ccData.length == 0) retrieveData();
        // ref.current?.setAddressText('Some Text');
    }, [ClientId, UserId]);
    useEffect(() => {
        if (ccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId]);
    useEffect(() => {
        calCulateTotalTime(startTime, endTime);
    }, [startTime, endTime]);
    useEffect(() => {
        calCulateTotalTimeSec(secstartTime, secendTime);
    }, [secstartTime, secendTime]);
    useEffect(() => {
        removeAssetData();
        if (workdoneTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [workdoneTrans]);
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
                const response = await Usage(data);
                const datas = await response.json();
                const RegData = datas.regList;
                const Utrans = datas.utransList;
                setCCId(RegData.CostCentreId);
                setCCName(RegData.CostCentreName);
                setVendorId(RegData.VendorId);
                setVendorName(RegData.VendorName);
                setUnitName(RegData.UnitName);
                setSecAssetId(RegData.SecAssetId);
                if (RegData.AssetType == 'H') {
                    setAssetType('2');
                    setHassetId(RegData.AssetId);
                    setHassetName(RegData.AssetName);
                } else {
                    setAssetType('1');
                    setOassetId(RegData.AssetId);
                    setOassetName(RegData.AssetName);
                }
                setUsageType(RegData.UsageType);
                setTrackType(RegData.TrackType);
                setUsageQty(RegData.Qty);

                setOrderData(datas.orderList);
                setOperatorData(datas.operatorList);
                setOperatorListItems(datas.operatorList);
                setOrderId(RegData.OrderId);

                setStartReading(Utrans.StartReading);
                setEndReading(Utrans.EndReading);
                setTotalReading(Utrans.EndReading - Utrans.StartReading);
                setStartTime(new Date(Utrans.StartTime));
                setEndTime(new Date(Utrans.EndTime));
                setFromLocation(Utrans.FromLocation);
                setToLocation(Utrans.ToLocation);
                setOpeningFuel(Utrans.OpeningFuel);
                setClosingFuel(Utrans.ClosingFuel);
                setOperatorId(Utrans.OperatorId);
                setOperatorName(Utrans.OperatorName);
                setTotDays(Utrans.TotalDays);
                setTotHrs(Utrans.TotalHrs);
                setTotMinutes(Utrans.TotalMinutes);

                if (RegData.SecAssetId != 0) {

                    if (Utrans.SecStartTime != '') setSecStartTime(new Date(Utrans.SecStartTime));
                    else setSecStartTime(new Date());

                    if (Utrans.SecEndTime != '') setSecStartTime(new Date(Utrans.SecEndTime));
                    else setSecEndTime(new Date());

                    setSecStartReading(Utrans.SecStartReading);
                    setSecEndReading(Utrans.SecEndReading);
                    setSecOpeningFuel(Utrans.SecOpeningFuel);
                    setSecClosingFuel(Utrans.SecClosingFuel);
                    setSecTotDays(Utrans.SecTotalDays);
                    setSecTotHrs(Utrans.SecTotalHrs);
                    setTotMinutes(Utrans.SecTotalMinutes);
                }

                setAssetData(datas.iowList);
                setAssetListItems(datas.iowList);
                setMAssetData(datas.iowList);
                setWBS(datas.wbs);

                setNextShow(1);
                setApprove(RegData.Approve);
                setRemarks(Utrans.Remarks);

                setWorkdoneTrans(datas.transList);
                setscreenshow(0);
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getentryData",
                };
                const response = await Usage(data)
                const datas = await response.json();
                setCCData(datas.ccList);
                setCCListItems(datas.ccList);
                setOperatorData(datas.operatorList);
                setOperatorListItems(datas.operatorList);
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
    const onChangeSearchoasset = (query) => {
        try {
            if (query) {
                const newData = oassetListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setOassetData(newData);
                setOassetSearch(query);
            } else {
                setOassetData(oassetListItems);
                setOassetSearch(query);
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
    const onChangeSearchhasset = (query) => {
        try {
            if (query) {
                const newData = hassetListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setHassetData(newData);
                setHassetSearch(query);
            } else {
                setHassetData(hassetListItems);
                setHassetSearch(query);
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
        if (iCostcentreId != 0) setNextShow(1);
        else setNextShow(0);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getVendorAssetData'

        };
        const response = await Usage(data)
        var datas = await response.json();
        setVendorData(datas.vendorList);
        setVendorListItems(datas.vendorList);
        setOassetData(datas.assetList);
        setOassetListItems(datas.assetList);
    }
    const changeOrder = async (argId) => {
        setOrderId(argId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            VendorId: vendorId,
            OrderId: argId,
            type: 'getHireAsset'
        };
        const response = await Usage(data)
        var datas = await response.json();
        setHassetData(datas);
        setHassetListItems(datas);
    }
    const actionOnRowoasset = async (item) => {
        setOassetName(item.Name);
        setOassetModalVisible(false);
        var ioassetId = item.Id;
        setOassetId(ioassetId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: ccId,
            OAssetId: ioassetId,
            HAssetId: 0,
            orderId: orderId,
            type: 'getAssetData'
        };
        const response = await Usage(data)
        var datas = await response.json();
        setAssetData(datas.iowList);
        setAssetListItems(datas.iowList);
        setMAssetData(datas.iowList);
        setTrackType(datas.trackType);
        setStockQty(datas.stock);
        setUnitName(datas.unitName);
        setOpeningFuel(datas.closingFuel);
        setStartReading(datas.closingReading);
        setEndReading(datas.closingReading);
        setSecStartReading(datas.secopeningReading);
        setSecOpeningFuel(datas.secopeningFuel);
        setSecAssetId(datas.secAssetId);
        setUsageType(datas.usageType);
        setWBS(datas.wbs);
    }
    const actionOnRowOperator = async (item) => {
        setOperatorName(item.Name);
        setOperatorModalVisible(false);
        var ioperatorId = item.Id;
        setOperatorId(ioperatorId);
    }
    const actionOnRowhasset = async (item) => {
        setHassetName(item.Name);
        setHassetModalVisible(false);
        var ihassetId = item.Id;
        setHassetId(ihassetId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: ccId,
            OAssetId: 0,
            HAssetId: ihassetId,
            orderId: orderId,
            type: 'getAssetData'
        };
        const response = await Usage(data)
        var datas = await response.json();
        setAssetData(datas.iowList);
        setAssetListItems(datas.iowList);
        setMAssetData(datas.iowList);
        setTrackType(datas.trackType);
        setStockQty(datas.stock);
        setUnitName(datas.unitName);
        setOpeningFuel(datas.closingFuel);
        setStartReading(datas.closingReading);
        setEndReading(datas.closingReading);
        setUsageType(datas.usageType);
        setWBS(datas.wbs);
    }
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
        const response = await Usage(data)
        var dataa = await response.json();
        setOrderData(dataa);
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
    function actionOnFromLocation(item) {
        setFromLocation(item);
        setgeoFromModalVisible(false);
    }
    function actionOnToLocation(item) {
        setToLocation(item);
        setgeoToModalVisible(false);
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
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    function oassetHandleChange() {
        setOassetModalVisible(false)
    }
    function operatorHandleChange() {
        setOperatorModalVisible(false)
    }
    function hassetHandleChange() {
        setHassetModalVisible(false)
    }
    function vendorhandleChange() {
        setVendorModalVisible(false)
    }
    function assethandleChange() {
        setAssetModalVisible(false)
    }
    function AssetAddhandleChange() {
        setAssetAddModalVisible(false)
    }
    function backScreen(argId) {
        setscreenshow(argId);
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
            alert("Select Costcentre");
            return;
        }
        if (trackType == 'B') {
            if (usageQty == 0) {
                setsubmitClick(false);
                alert("Entry Usage Qty for this Bulk Asset");
                return;
            }
        } else {
            setUsageQty(1);
        }
        if (CommonFun.FloatVal(endReading) < 0) {
            setsubmitClick(false);
            alert("End Reading Less than Start Reading");
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
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setWorkdoneTrans(tmptrans);
        }
    }
    function nextScreen(argId) {
        if (argId == 1) {
            if (ccId == 0) {
                alert("Select CostCentre");
                return;
            }
            if (assetType == 1) {
                if (oassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            } else {
                if (vendorId == 0) {
                    alert("Select Asset");
                    return;
                }
                if (orderId == 0) {
                    alert("Select Order");
                    return;
                }
                if (hassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            }
        }
        setscreenshow(argId);
    }
    function showAssetList() {
        if (workdoneTrans.length > 0) {
            setscreenshow(1);
        } else {
            if (ccId == 0) {
                alert("Select CostCentre");
                return;
            }
            if (assetType == 1) {
                if (oassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            } else {
                if (vendorId == 0) {
                    alert("Select Vendor");
                    return;
                }
                if (orderId == 0) {
                    alert("Select Order");
                    return;
                }
                if (hassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            }
            setAssetModalVisible(true);
        }
    }
    const updateData = async () => {
        try {
            let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
            let dendTime = Moment(endTime).format('YYYY-MMM-DD HH:mm:ss');
            let dsecstartTime = Moment(secstartTime).format('YYYY-MMM-DD HH:mm:ss');
            let dsecendTime = Moment(secendTime).format('YYYY-MMM-DD HH:mm:ss');
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                CostcentreId: ccId,
                assetType: assetType,
                usageType: usageType,
                vendorId: vendorId,
                orderId: orderId,
                oAssetId: oassetId,
                hAssetId: hassetId,
                Qty: usageQty,
                startTime: dstartTime,
                endTime: dendTime,
                startReading: startReading,
                endReading: endReading,
                openingFuel: openingFuel,
                closingFuel: closingFuel,
                FromLocation: fromLocation,
                ToLocation: toLocation,
                TotDays: totDays,
                TotHours: totHrs,
                TotMinutes: totMinutes,
                secstartReading: secstartReading,
                secendReading: secendReading,
                secstartTime: dsecstartTime,
                secendTime: dsecendTime,
                secTotDays: sectotDays,
                secTotHours: sectotHrs,
                secTotMinutes: sectotMinutes,
                secopeningFuel: secopeningFuel,
                secclosingFuel: secclosingFuel,
                secTotDays: sectotDays,
                secTotHours: sectotHrs,
                secTotMinutes: sectotMinutes,
                OperatorId: operatorId,
                trans: workdoneTrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                secAssetId: secAssetId,
                type: "updateUsage",
            };
            const response = await Usage(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                // alert("Updated Sucessfully");
                props.navigation.navigate('UsageMenu');
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
                iowIds: sAssetIds,
                assetType: assetType,
                OAssetId: oassetId,
                HAssetId: hassetId,
                wbs: wbs,
                type: "getWorkDoneData",
            };
            const response = await Usage(data);
            const datas = await response.json();
            let tempTrans = [...workdoneTrans];
            tempTrans.push(...datas);
            setWorkdoneTrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
    function updateUsageQty(argValue) {
        let dQty = argValue;
        if (CommonFun.FloatVal(dQty) > CommonFun.FloatVal(stockQty)) {
            alert("Qty greater than Stock Qty");
            dQty = 0;
        }
        setUsageQty(dQty);
    }
    function updateEndReading(argValue) {
        let dReading = argValue;
        let dStartReading = startReading;
        let dTotal = CommonFun.FloatVal(dReading) - CommonFun.FloatVal(dStartReading);
        setEndReading(dReading);
        setTotalReading(dTotal);
    }
    function updateEndReadingSec(argValue) {
        let dReading = argValue;
        let dStartReading = secstartReading;
        let dTotal = CommonFun.FloatVal(dReading) - CommonFun.FloatVal(dStartReading);
        setSecEndReading(dReading);
        setSecTotalReading(dTotal);
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
    function updateWorkingQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);
        tmptrans[index] = { ...tmptrans[index], WorkingQty: dQty };
        setWorkdoneTrans(tmptrans);
        return dQty;
    }
    function updateWorkDoneQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);
        tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        setWorkdoneTrans(tmptrans);
        return dQty;
    }
    function updateWorkRate(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...workdoneTrans];
        let index = tmptrans.findIndex(el => el.Id === argId);
        tmptrans[index] = { ...tmptrans[index], WorkRate: dQty };
        setWorkdoneTrans(tmptrans);
        return dQty;
    }
    function handleConfirmFrom(argValue) {
        if (new Date(argValue) > new Date(endTime)) {
            alert("Start Time greater than End Time");
            setShowFromTime(false);
        } else {
            setStartTime(argValue);
            setShowFromTime(false);
            calCulateTotalTime(argValue, endTime);
        }
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
        let sTotTime = '';
        if (days > 0) {
            if (days == 1) sTotTime = days.toString() + " day ";
            else sTotTime = days.toString() + " days ";
        }
        if (hours > 0) {
            if (hours == 1) sTotTime = sTotTime + hours.toString() + " hour ";
            else sTotTime = sTotTime + hours.toString() + " hours";
        }
        if (minutes > 0) {
            if (minutes == 1) sTotTime = sTotTime + minutes.toString() + " minute";
            else sTotTime = sTotTime + minutes.toString() + " minutes";
        }
        setTotalTime(sTotTime);
    }
    function hideDatePickerFrom() {
        setShowFromTime(false);
    }
    function hideDatePickerEnd() {
        setShowEndTime(false);
    }


    function handleConfirmFromSec(argValue) {
        if (new Date(argValue) > new Date(secendTime)) {
            alert("Start Time greater than End Time");
            setSecShowFromTime(false);
        } else {
            setSecStartTime(argValue);
            setSecShowFromTime(false);
            calCulateTotalTimeSec(argValue, endTime);
        }
    }
    function handleConfirmEndSec(argValue) {
        if (new Date(secstartTime) > new Date(argValue)) {
            alert("End Time less than Start Time");
            setSecShowEndTime(false);
        } else {
            setSecEndTime(argValue);
            setSecShowEndTime(false);
            calCulateTotalTimeSec(startTime, argValue);
        }
    }
    function calCulateTotalTimeSec(argFDate, argTDate) {
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
        let sTotTime = '';
        if (days > 0) {
            if (days == 1) sTotTime = days.toString() + " day ";
            else sTotTime = days.toString() + " days ";
        }
        if (hours > 0) {
            if (hours == 1) sTotTime = sTotTime + hours.toString() + " hour ";
            else sTotTime = sTotTime + hours.toString() + " hours";
        }
        if (minutes > 0) {
            if (minutes == 1) sTotTime = sTotTime + minutes.toString() + " minute";
            else sTotTime = sTotTime + minutes.toString() + " minutes";
        }
        setSecTotalTime(sTotTime);
    }
    function hideDatePickerFromSec() {
        setSecShowFromTime(false);
    }
    function hideDatePickerEndSec() {
        setSecShowEndTime(false);
    }
    function goNext() {
        if (currentStep == 0) {
            if (ccId == 0) {
                alert("Select CostCentre");
                return;
            }
            if (assetType == 1) {
                if (oassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            } else {
                if (vendorId == 0) {
                    alert("Select Asset");
                    return;
                }
                if (orderId == 0) {
                    alert("Select Order");
                    return;
                }
                if (hassetId == 0) {
                    alert("Select Asset");
                    return;
                }
            }
            wizard.current.next();
        } else {
            wizard.current.next();
        }
    }
    const stepList = [{
        content: <View style={{ minwidth: '100%', height: '95%' }}>
            <View style={styles.mtxttop}>
                <Text style={styles.labeltxt}>CostCentre Name</Text>
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
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '98%', marginLeft: '1%', marginRight: '1%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Asset Type</Text>
                        <View style={{ borderWidth: 1, borderColor: '#a7b7d9', height:50,paddingLeft:10,paddingTop:15,}} pointerEvents={seldisabled}>
                            {
                                Platform.OS == 'android' ?
                                    <Picker
                                        selectedValue={assetType}
                                        style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                        onValueChange={(itemValue, itemIndex) => setAssetType(itemValue)}
                                    >
                                        <Picker.Item label="Own Asset" value="1" />
                                        <Picker.Item label="Hire Asset" value="2" />
                                    </Picker>
                                    :
                                    <RNPickerSelect
                                        selectedValue={assetType}
                                        style={{ height: 50, width: '100%', borderWidth: 1, padding: 0 }}
                                        placeholderTextColor="#ccc"
                                        items={[
                                            { label: 'Idle', value: '1' },
                                            { label: 'In use', value: '2' },
                                        ]}
                                        onValueChange={(itemValue, itemIndex) => setAssetType(itemValue)}>
                                    </RNPickerSelect>
                            }

                        </View>
                    </View>
                </View>
            </View>
            <View style={assetType == 2 ? styles.mtxttop : styles.hide}>
                <Text style={styles.labeltxt}>Vendor Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={vendorModalVisible} data={vendorData} onChange={vendorhandleChange} onChangeSearch={onChangeSearchVendor} search={vendorSearch} actionOnCancel={setVendorModalVisible} actionOnRow={actionOnRowVendor} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setVendorModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{vendorName ? vendorName : 'Select Vendor Name'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={assetType == 2 ? styles.row1.mtxttop : styles.hide}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainer.pickerView}>
                            <Text style={styles.labeltxt}>Order No</Text>
                            <View style={{ borderWidth: 1, borderColor: '#a7b7d9', width: "100%" ,height:50,paddingLeft:10,paddingTop:15,}} pointerEvents={seldisabled}>
                                {
                                    Platform.OS == 'android' ?

                                        <Picker
                                            style={{ height: 50, width: '100%', borderWidth: 1, }}
                                            mode="dropdown"
                                            selectedValue={orderId}
                                            onValueChange={(itemValue, itemIndex) => changeOrder(itemValue)}
                                        >
                                            {orderData.map((key) => {
                                                return (<Picker.Item label={key.OrderNo} value={key.OrderId} key={key.OrderId} />)
                                            })}
                                        </Picker>
                                        :
                                        <RNPickerSelect
                                            selectedValue={orderId}
                                            style={{ height: 50, width: '100%', borderWidth: 1, }}
                                            placeholderTextColor="#ccc"
                                            items={[
                                                { label: 'Idle', value: '1' },
                                                { label: 'In use', value: '2' },
                                            ]}
                                            onValueChange={(itemValue, itemIndex) => changeOrder(itemValue)}>
                                        </RNPickerSelect>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={assetType == 1 ? styles.row1.mtxttop : styles.hide}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainer.pickerView}>
                            <Text style={styles.labeltxt}>Asset Name</Text>
                            <View style={styles.centeredView} pointerEvents={seldisabled}>
                                <SPickList visible={oassetModalVisible} data={oassetData} onChange={oassetHandleChange} onChangeSearch={onChangeSearchoasset} search={oassetSearch} actionOnCancel={setOassetModalVisible} actionOnRow={actionOnRowoasset} />
                                <Pressable
                                    style={[styles.button, styles.buttonOpen]}
                                    onPress={() => setOassetModalVisible(true)}
                                >
                                    <Text style={styles.textStyle}>{oassetName ? oassetName : 'Select Asset Name'}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={assetType == 2 ? styles.row1.mtxttop : styles.hide}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainer.pickerView}>
                            <Text style={styles.labeltxt}>Hire Asset Name</Text>
                            <View style={styles.centeredView} pointerEvents={seldisabled}>
                                <SPickList visible={hassetModalVisible} data={hassetData} onChange={hassetHandleChange} onChangeSearch={onChangeSearchhasset} search={hassetSearch} actionOnCancel={setHassetModalVisible} actionOnRow={actionOnRowhasset} />
                                <Pressable
                                    style={[styles.button, styles.buttonOpen]}
                                    onPress={() => setHassetModalVisible(true)}
                                >
                                    <Text style={styles.textStyle}>{hassetName ? hassetName : 'Select Asset Name'}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            {/* <ScrollView> */}
            <View style={trackType == 'B' ? styles.row1.mtxttop : styles.hide}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer2}>
                        <View style={styles.inputContainer.pickerView}>
                            <Text style={styles.labeltxt}>Qty</Text>
                            <TextInput
                                style={styles.input}
                                value={usageQty ? usageQty.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateUsageQty(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer2}>
                        <Text style={[styles.labeltxt, { marginTop: 27, color: 'black' }]}>({unitName})</Text>
                    </View>
                </View>
            </View>



            <View style={[styles.row1, { backgroundColor: '#ccd2e0', paddingBottom: 10, }]}>
                <View>
                    <Text style={[styles.colheader, { paddingLeft: 8, paddingTop: 3, }]} >Primary Engine</Text>
                </View>
                <View style={trackType != 'B' && (usageType == 'U' || usageType == 'B') ? styles.row : styles.hide}>
                    <View style={styles.row1}>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >Start Reading</Text>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >End Reading</Text>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >Total Reading</Text>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginBottom: 15 }]}>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={startReading ? startReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={endReading ? endReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateEndReading(text)}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={totalReading ? totalReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            //onChangeText={text => setTotalReading(text)}
                            />
                        </View>
                    </View>
                </View>


                <View style={trackType == 'B' || (usageType == 'T' || usageType == 'B') ? styles.row : styles.hide}>
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
                                onPress={() => setShowFromTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(startTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 3, }]}>
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
                                date={endTime}
                                // value={endTime}
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
                    </View>
                    <View style={[styles.row1, { marginBottom: 10, marginTop: 5 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Total Time</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={totalTime}
                                // keyboardType="numeric"
                                // maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col3}>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col3}>
                        </View>
                    </View>
                </View>

                <View style={trackType == 'B' ? styles.hide : styles.row}>
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
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 3, marginBottom: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Colsing Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={closingFuel ? closingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateClosingFuel(text)}
                            />
                        </View>
                    </View>
                </View>
            </View>
            {/* engine 2 */}
            <View style={[(secAssetId == 0) ? styles.hide : styles.row1, { backgroundColor: '#ccd2e0', paddingBottom: 10, marginTop: 5, }]}>
                <View>
                    <Text style={[styles.colheader, { paddingLeft: 8, paddingTop: 2, }]} >Secondary Engine</Text>
                </View>
                <View style={trackType != 'B' && (usageType == 'U' || usageType == 'B') ? styles.row : styles.hide}>
                    <View style={styles.row1}>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >Start Reading</Text>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >End Reading</Text>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <Text style={styles.colheader} >Total Reading</Text>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginBottom: 15 }]}>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={secstartReading ? secstartReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={secendReading ? secendReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateEndReadingSec(text)}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col31}>
                            <TextInput
                                style={styles.input}
                                value={sectotalReading ? sectotalReading.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            //onChangeText={text => setTotalReading(text)}
                            />
                        </View>
                    </View>
                </View>
                <View style={trackType == 'B' || (usageType == 'T' || usageType == 'B') ? styles.row : styles.hide}>
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
                                onPress={() => setSecShowFromTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(secstartTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 3, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >End Time</Text>
                        </View>
                        <View style={styles.col70}>
                            <DateTimePickerModal
                                isVisible={secshowEndTime}
                                mode="datetime"
                                is24Hour={true}
                                onConfirm={(date) => handleConfirmEndSec(date)}
                                onCancel={hideDatePickerEndSec}
                                date={secendTime}
                                // value={endTime}
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
                                onPress={() => setSecShowEndTime(true)}
                            >
                                <Text style={styles.textInput} > {Moment(secendTime).format('DD-MM-yyyy hh:mm a')}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={[styles.row1, { marginBottom: 10, marginTop: 5 }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Total Time</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={sectotalTime}
                                // keyboardType="numeric"
                                // maxLength={10}
                                editable={false}
                            />
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col3}>
                        </View>
                        <View style={styles.colsplit}></View>
                        <View style={styles.col3}>
                        </View>
                    </View>
                </View>
                <View style={trackType == 'B' ? styles.hide : styles.row}>
                    <View style={[styles.row1, { marginTop: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Opening Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={secopeningFuel ? secopeningFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={[styles.row1, { marginTop: 3, marginBottom: 10, }]}>
                        <View style={styles.col3}>
                            <Text style={styles.coltime} >Colsing Fuel</Text>
                        </View>
                        <View style={styles.col70}>
                            <TextInput
                                style={styles.input}
                                value={secclosingFuel ? secclosingFuel.toString() : ''}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={text => updateClosingFuelSec(text)}
                            />
                        </View>
                    </View>
                </View>
            </View>
            {/* engine2 */}

            <View style={trackType == 'B' ? styles.hide : styles.row}>
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
                <View style={[styles.row1, { marginTop: 3, marginBottom: 10, height: 40 }]}>
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
                                        {/* <Text style={styles.deletetext}>Delete</Text> */}
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
                                <View style={styles.col50}>
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
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Working Qty</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col50}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.WorkingQty ? item.WorkingQty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => updateWorkingQty(text, item.Id)}
                                        editable={approve == 'Y' ? false : true}
                                    />
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.unit}>{item.WorkUnitName}</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Working Rate</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col50}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.WorkRate ? item.WorkRate.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => updateWorkRate(text, item.Id)}
                                        editable={approve == 'Y' ? false : true}
                                    />
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.unit} >{item.WorkUnitName}</Text>
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
        content: <View style={{ minwidth: '100%', height: '95%' }} >
            <View style={styles.row1.mtxttop}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputContainer.pickerView}>
                            <Text style={styles.labeltxt}>Operator Name</Text>
                            <View style={styles.centeredView}>
                                <AddOperator visible={operatorModalVisible} data={operatorData} listitem={operatorListItems} setdata={setOperatorData} setlistitem={setOperatorListItems} onChange={operatorHandleChange} onChangeSearch={onChangeSearchOperator} search={operatorSearch} actionOnCancel={setOperatorModalVisible} actionOnRow={actionOnRowOperator} />
                                <Pressable
                                    style={[styles.button, styles.buttonOpen]}
                                    onPress={() => setOperatorModalVisible(true)}
                                >
                                    <Text style={styles.textStyle}>{operatorName ? operatorName : 'Select Operator Name'}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row1.mtxttop}>
                <View style={styles.Flatlistview}>
                    <View style={styles.inputContainer}>
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
                </View>
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
                <Button disabled={isFirstStep} title="Prev" onPress={() => wizard.current.prev()} />
                <Text>Step {currentStep + 1}. of 4</Text>
                <Button disabled={isLastStep} title="Next" onPress={() => goNext()} />
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
export default UsageEntry;
const styles = StyleSheet.create({
    mtxttop: {
        margin: 10,
    },
    labeltxt: {
        color: '#022969',
        fontWeight: 'bold'
    },
    hide: {
        display: 'none'
    },
    input: {
        textAlign: 'right',
        height: 35,
        borderWidth: 1,
        width: '30%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        paddingHorizontal: 10,
    },
    Locationinput:
    {
        textAlign: 'right',
        height: 40,
        borderWidth: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: 'black'
    },
    inputremarks: {
        borderWidth: 1,
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: '#a7b7d9',
        textAlign: 'left',
        height: 70,
        justifyContent: "flex-start",
        paddingLeft: 15,
        paddingRight: 10,
    },
    button: {
        // borderRadius: 20,
        padding: 15,
        // elevation: 2,
        backgroundColor: 'transparent',
        borderWidth: 1,
        // bordercolor:'black'

        borderColor: '#a7b7d9'
    },
    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 1,
        marginBottom: 1,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 4,
        borderLeftColor: "#040485",
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
        textAlign: 'left',
        paddingTop: 10,
        paddingRight: 10,
        marginLeft: 3,
        fontSize: 13,
    },

    Flatlistview:
    {
        margin: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
        backgroundColor: '#040485',
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
        backgroundColor: '#040485',
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
    itemtittle:
    {
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
        marginHorizontal: '2%'
    },
    Flatlistview1:
    {
        margin: 0,
        flexDirection: 'row',
        width: '98%',
        marginLeft: '1%',
        marginRight: '1%',
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
        paddingTop: 1,
        width: "98%",
        marginLeft: '1%',
        marginRight: '1%',

    },
    pickerView: {
        width: "96%",
        marginLeft: '2%',
        marginRight: '2%',
    },

    row:
    {
        marginTop: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: '#fff',
        width: "96%",
        marginLeft: '2%',
        marginRight: '2%',
        borderRadius: 1,
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
        elevation: 2,
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: '#040485',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        borderRadius: 5,
        maxWidth: '80%',
        marginLeft: '20%',
        alignItems: "center",
        justifyContent: "center",
    },
    btnContainerprenxt: {
        flexDirection: 'row',
        backgroundColor: '#040485',
        padding: 5,
        borderRadius: 5,
        maxWidth: '40%',
        marginLeft: '20%',
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
    colsplit: {
        width: '3%',
    },
    col3: {
        width: '30%',
    },
    col31: {
        width: '31%',
    },
    col7: {
        width: '82%',
    },
    col70: {
        width: '70%',
    },
    col2: {
        width: '18%',
    },
    col4: {
        width: '40%',
    },

    col5: {
        width: '5%',
    },
    col50: {
        width: '50%',
    },
    col10: {
        width: '98%',
    },
    colon:
    {
        paddingTop: 10,
    },
    itemtittle:
    {
        paddingTop: 10,
    },
    input: {
        height: 40,
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor: '#a7b7d9',
        textAlign: 'right',
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13,
    },
    itemTitle2: {
        textAlign: 'left', // <-- the magic
        fontSize: 16,
        marginTop: 0,
        width: '100%',
        color: '#022969'
    },
    availableQty:
    {
        paddingTop: 10,
        color: '#02691a',
        fontWeight: 'bold',
    },
    colheader:
    {
        paddingTop: 10,
        //  color: '#02691a',
        color: '#022969',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    coltime:
    {
        paddingTop: 10,
        marginLeft: 20,
        color: '#022969',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    collocation: {
        paddingTop: 10,
        marginLeft: 10,
        color: '#022969',
        fontWeight: 'bold',
        textAlign: 'left',
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
        // backgroundColor: 'red',
        paddingHorizontal: 1,
        paddingVertical: 2,
        borderRadius: 5,
        // width: '15%',
    },
    marg5:
    {
        margin: 2,
    }
    , textStyle:
    {
        color: 'black',
    }
    , btnIcon: {
        marginTop: 0, height: 20, marginRight: 10,
    },
    datePickerStyle: {
        width: '100%',
        padding: 1,
        paddingTop: 6,
        borderWidth: 0,
    },
    textInput:
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
})