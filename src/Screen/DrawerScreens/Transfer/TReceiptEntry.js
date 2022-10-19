import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Transfer } from '../../../service/api/apiservice';
import Wizard from "react-native-wizard"
import Loader from '../../Components/Loader';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from 'moment';
import SPickList from '../../Components/sPickList';
import GeoPickList from '../../Components/geoPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
const TReceiptEntry = (props) => {
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

    const [tccListItems, setTCCListItems] = useState([]);
    const [tccData, setTCCData] = useState([]);
    const [tccSearch, setTCCSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [tccId, setTCCId] = useState(0);
    const [tccName, setTCCName] = useState('');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [tccModalVisible, setTCCModalVisible] = useState(false);

    const [transferTrans, setTransferTrans] = useState([]);
    const [seldisabled, setseldisabled] = useState('auto');

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [submitClick, setsubmitClick] = useState(false);

    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [totalTime, setTotalTime] = useState('');

    const [totDays, setTotDays] = useState(0);
    const [totHrs, setTotHrs] = useState(0);
    const [totMinutes, setTotMinutes] = useState(0);

    const [startReading, setStartReading] = useState('0');
    const [endReading, setEndReading] = useState('0');
    const [totalReading, setTotalReading] = useState('0');

    const [eWayBillNo, seteWayBillNo] = React.useState("");
    const [eWayBillAmt, seteWayBillAmt] = React.useState(0);

    const [vehicleNo, setvehicleNo] = useState('');
    const [vehicleName, setvehicleName] = useState('');

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
    const [vehicleType, setVehicleType] = useState('1');
    const [vehicleId, setVehicleId] = useState(0);
    const [operatorId, setOperatorId] = useState(0);
    const [operatorName, setOperatorName] = useState('');
    const [operatorModalVisible, setOperatorModalVisible] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    const [FYearId, setFYearId] = useState('');
    const [FYearCheck, setFYearCheck] = useState(0);

    useEffect(() => {
        if (ccData.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (transferTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
    }, [transferTrans]);
    useEffect(() => {
        if (ccId != 0 && tccId != 0) setwizardShow(true);
        else setwizardShow(false);
    }, [ccId, tccId]);
    useEffect(() => {
        calCulateTotalTime(startTime, endTime);
    }, [startTime, endTime]);
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
                    type: 'geteditreceiptdata'
                };
                const response = await Transfer(data);
                const datas = await response.json();
                const RegData = datas.regList;
                const vTrans = datas.vehicleTransList;
                console.log(RegData);
                setCCId(RegData.TCostCentreId);
                setCCName(RegData.TCostCentreName);
                setTCCId(RegData.TVRegisterId);
                setTCCName(RegData.RefNo);
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                seteWayBillNo(RegData.EBillWayNo);
                seteWayBillAmt(RegData.EBillWayAmount);
                setTransferTrans(datas.transList);
                if (vTrans) {
                    if (vTrans.VehicleType != 'O') setVehicleType(2);
                    else setVehicleType(1);
                    setVehicleId(vTrans.VehicleId);
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
                }
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getReceiptData",
                };
                const response = await Transfer(data)
                const datas = await response.json();
                setCCData(datas);
                setCCListItems(datas);
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
        setCCName(item.Name);
        setCCModalVisible(false);
        var iCostcentreId = item.Id;
        setCCId(iCostcentreId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            CostCentreId: iCostcentreId,
            type: 'getTransferNoData'

        };
        const response = await Transfer(data)
        var datas = await response.json();
        setTCCData(datas);
        setTCCListItems(datas);
    }
    const actionOnRowTCC = async (item) => {
        setTCCName(item.Name);
        setTCCModalVisible(false);
        var iTVRegId = item.Id;
        setTCCId(iTVRegId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            TVRegId: iTVRegId,
            type: 'getTransferData'
        };
        const response = await Transfer(data)
        var datas = await response.json();
        const RegData = datas.regList;
        seteWayBillNo(RegData.EBillWayNo);
        seteWayBillAmt(RegData.EBillWayAmount);
        setTransferTrans(datas.transList);
        const vTrans = datas.vehicleTransList;
        if (vTrans) {
            if (vTrans.VehicleType != 'O') setVehicleType(2);
            else setVehicleType(1);
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
    }
    const actionOnRowOperator = async (item) => {
        setOperatorName(item.Name);
        setOperatorModalVisible(false);
        var ioperatorId = item.Id;
        setOperatorId(ioperatorId);
    }
    function ccHandleChange() {
        setCCModalVisible(false)
    }
    function tccHandleChange() {
        setTCCModalVisible(false)
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
        if (FYearCheck==1) {
            if (FYearId==0) {
                setsubmitClick(false);
                alert('Company Fiscal Year not Found');
                return;
            }
        }
        if (transferTrans.length == 0) {
            setsubmitClick(false);
            alert("Select Asset");
            return;
        }
        let bQtyFound = false;
        for (var trans of transferTrans) {
            if (CommonFun.FloatVal(trans['ReceiptQty']) != 0) {
                bQtyFound = true;
                break;
            }
        }
        if (bQtyFound ==false) {
            setsubmitClick(false);
            alert("No Qty Entered")
            return;
        }
        setLoading(true);
        updateData();
    }
    const updateData = async () => {
        try {
            let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
            let dendTime = Moment(endTime).format('YYYY-MMM-DD HH:mm:ss');
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                CostcentreId: ccId,
                TVRegId: tccId,
                // vehicleType: vehicleType,
                // vehicleId: vehicleId,
                // vehicleName: vehicleName,
                // vehicleNo: vehicleNo,
                eWayBillNo: eWayBillNo,
                eWayBillAmt: eWayBillAmt,
                startReading: startReading,
                endReading: endReading,
                startTime: dstartTime,
                endTime: dendTime,
                TotDays: totDays,
                TotHours: totHrs,
                TotMinutes: totMinutes,
                openingFuel: openingFuel,
                closingFuel: closingFuel,
                fromLocation: fromLocation,
                toLocation: toLocation,
                OperatorId: operatorId,
                trans: transferTrans,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude:gLongitude,
                type: "updateReceipt",
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
    function checkQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...transferTrans];
        let index = tmptrans.findIndex(el => el.TransferTransId === argId);
        let dAQty = CommonFun.FloatVal(tmptrans[index]['DespatchQty']);
        if (CommonFun.FloatVal(dQty) > dAQty) {
            alert("Qty greater than despatch Qty");
            dQty = 0;
        }
        tmptrans[index] = { ...tmptrans[index], ReceiptQty: dQty };
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
        content: <View style={{ minwidth: '100%', height: '95%', backgroundColor: COLORS.white }}>
            <View style={styles.mtxttop}>
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
            {/* <ScrollView> */}
            <View style={{ marginBottom: 50 }}>
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={transferTrans}
                    keyExtractor={item => item.TransferTransId}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col7}>
                                    <Text style={styles.itemTitle2}> {item.AssetName.slice(0, 15)}   <Text style={styles.unit}>({item.UnitName})</Text> </Text>
                                </View>
                            </View>
                            <View style={styles.marg5}></View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={styles.availableQty} >Despatch Qty :</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}> {item.DespatchQty}</Text>
                                </View>
                                <View style={styles.col2}>
                                    <Text style={styles.enterQty}>Receipt Qty:</Text>
                                </View>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.input}
                                        value={item.ReceiptQty ? item.ReceiptQty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => checkQty(text, item.TransferTransId)}
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
        content: <View style={{ minwidth: '100%', height: '95%', backgroundColor: COLORS.white }} >
            <View style={styles.row}>
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
                            editable={false}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, style = { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={styles.coltime} >Vehicle No</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input1}
                            value={vehicleNo}
                            // keyboardType="numeric"
                            maxLength={50}
                            onChangeText={setvehicleNo}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, style = { marginTop: 1, }]}>
                    <View style={styles.col48}>
                        <Text style={styles.coltimeleft} >Start Reading</Text>
                        <TextInput
                            style={styles.input}
                            value={startReading ? startReading.toString() : ''}
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
            <View style={styles.row}>
                <View style={[styles.row1, style = { backgroundColor: COLORS.white, margin: 2, borderRadius: 5, marginLeft: 3, }]}>
                    <View style={styles.col48}>
                        <Text style={styles.coltimeleft} >Start Time</Text>
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
                            date={startTime}
                            //value={endTime}
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
                                    paddingLeft: -10,
                                  

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
            <View style={[styles.row]}>
                <View style={[styles.row1, { backgroundColor: COLORS.white, margin: 2, borderRadius: 5, marginLeft: 3 }]}>
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
            <View style={styles.row}>
                <View style={[styles.row1, style = { backgroundColor: COLORS.white, margin: 2, borderRadius: 5, marginLeft: 3, }]}>
                    <View style={[styles.row1, style = { marginTop: 10, height: 40, }]}>
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
                    <View style={[styles.row1, style = { marginTop: 3, marginBottom: 10, height: 60, }]}>
                        <View style={styles.col3}>
                        <Text style={[styles.collocation,{marginLeft:3,marginTop:25,}]} >To Location</Text>
                        </View>
                        <View style={styles.col70}>
                            <Pressable
                                onPress={() => setgeoToModalVisible(true)}>
                                <Text style={styles.Locationinput1}>{toLocation ? toLocation : 'Select To Location'}
                                    <GeoPickList styles={{ height: 1, width: 1 }} visible={geoToModalVisible} data={toLocation} actionOnCancel={setgeoToModalVisible} actionOnRow={actionOnToLocation} />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.row}>
                <View style={[styles.row1, style = { marginTop: 10, }]}>
                    <View style={styles.col3}>
                        <Text style={[styles.collocation,{marginLeft:3,marginTop:5,}]} >Operator Name</Text>
                    </View>
                    <View style={styles.col70}>
                        <TextInput
                            style={styles.input1}
                            value={operatorName}
                            // keyboardType="numeric"
                            maxLength={50}
                            onChangeText={setOperatorName}
                            editable={false}
                        />
                    </View>
                </View>
            </View>
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%', backgroundColor:COLORS.white, }} >
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
                    justifyContent: "space-between", flexDirection: "row", backgroundColor: "#ffff",
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
export default TReceiptEntry;
const styles = StyleSheet.create({
    mtxttop: {
        margin: 10,
    },
    Locationinput:
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
        borderLeftColor:COLORS.brdleftblue,
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
        width: '98%'
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

    row:
    {
        // marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: COLORS.white,
        PaddingBottom: 10,
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
    colon:
    {
        paddingTop: 10,
    },
    itemtittle:
    {
        paddingTop: 10,
    },
    input: {
        height: 50,
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: '100%',
        borderWidth: 1,
        borderColor:COLORS.brdleftblue,
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
    col70: {
        width: '70%',
    },
    col48: {
        width: '46.5%',
        marginLeft: '2.5%'
    },
    col49: {
        width: '49%',
        marginLeft: '0.5%'
    },
    input1: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        marginRight: '55%',
        borderWidth: 1,
        borderColor:COLORS.brdleftblue,
        textAlign: 'left'
    },
    coltime:
    {
        paddingTop: 10,
        marginLeft: 10,
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
    collocation: {
        paddingTop: 10,
        marginLeft: 10,
        color: FONTCOLORS.primary,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    Locationinput1:
    {
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.brdleftblue,
        textAlign: 'left',
        color: 'black',
        // fontWeight: 'bold',
        fontSize: 13,
        marginTop: 20,
    },
})