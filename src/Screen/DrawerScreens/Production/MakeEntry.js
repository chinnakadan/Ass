import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Make } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import Wizard from "react-native-wizard"
import SPickList from '../../Components/sPickList';
import MPickList from '../../Components/mPickList';
import Moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import CommonFun from '../../Components/CommonFun';
import DatePicker from 'react-native-datepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect  from 'react-native-picker-select';

const MakeEntry = (props) => {
    const { RegisterId } = props.route.params;

    const wizard = useRef()
    const [isFirstStep, setIsFirstStep] = useState(true)
    const [isLastStep, setIsLastStep] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');

    const [ccListItems, setCCListItems] = useState([]);
    const [ccData, setCCData] = useState([]);
    const [ccSearch, setCCSearch] = useState('');
    const [approve, setApprove] = useState('N');

    const [plantListItems, setPlantListItems] = useState([]);
    const [plantData, setPlantData] = useState([]);
    const [plantSearch, setPlantSearch] = useState('');

    const [assetListItems, setAssetListItems] = useState([]);
    const [assetData, setAssetData] = useState([]);
    const [massetData, setMAssetData] = useState([]);
    const [assetSearch, setAssetSearch] = useState('');

    const [ccId, setCCId] = useState(0);
    const [ccName, setCCName] = useState('');

    const [plantId, setPlantId] = useState(0);
    const [plantName, setPlantName] = useState('');

    const [productData, setProductData] = useState([]);
    const [productId, setProductId] = useState(0);
    const [productName, setProductName] = useState('');
    const [productQty, setProductQty] = useState(0);
    const [productAmt, setProductAmt] = useState('0');
    const [totProducedQty, setTotProducedQty] = useState('0');

    const [ccModalVisible, setCCModalVisible] = useState(false);
    const [plantModalVisible, setPlantModalVisible] = useState(false);
    const [assetModalVisible, setAssetModalVisible] = useState(false);
    const [assetAddModalVisible, setAssetAddModalVisible] = useState(false);
    const [transferTrans, setTransferTrans] = useState([]);
    const [productList, setProductList] = useState([]);
    const [productAnal, setProductAnal] = useState([]);
    const [productTheo, setproductTheo] = useState([]);
    const [crusher, setCrusher] = useState(0);
    const [reference, setReference] = useState(false);
    const [seldisabled, setseldisabled] = useState('auto');
    const [editPQty, setEditPQty] = useState(false);

    const [loading, setLoading] = useState(false);
    const [remarks, setRemarks] = React.useState("");
    const [submitClick, setsubmitClick] = useState(false);
    const [wizardShow, setwizardShow] = useState(false);

    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    const [showFromTime, setShowFromTime] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    useEffect(() => {
        if (ccData.length == 0) retrieveData();
    }, [ClientId, UserId]);
    useEffect(() => {
        if (ccId != 0) setwizardShow(true);
        else setwizardShow(false);
        if (ccId != 0 && productId != 0 && RegisterId == 0) {
            getRequestList(productId);
        }
    }, [ccId]);
    useEffect(() => {
        removeAssetData();
        if (transferTrans.length > 0) setseldisabled('none');
        else setseldisabled('auto');
        calculateProdQty();
    }, [transferTrans]);
    useEffect(() => {
        calculateProdAmt();
    }, [productAnal]);
    useEffect(() => {
        calculateTotProdQty();
    }, [productList]);
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
                    type: 'geteditdataM'
                };
                const response = await Make(data);
                const datas = await response.json();
                const RegData = datas.regList;
                setCCId(RegData.PlantCostCentreId);
                setCCName(RegData.PlantCostCentreName);
                setPlantId(RegData.PlantId);
                setPlantName(RegData.PlantName);
                setProductData(datas.productionList);
                console.log(datas.productionList, 'data');
                setProductId(RegData.ProductId)
                setApprove(RegData.Approve);
                setRemarks(RegData.Narration);
                setStartTime(new Date(RegData.StartTime));
                setEndTime(new Date(RegData.EndTime));
                setAssetData(datas.requestList);
                setAssetListItems(datas.requestList);
                setMAssetData(datas.requestList);
                setProductList(datas.productList);
                setProductAnal(datas.analList);
                setTransferTrans(datas.transList);
            } else {
                let data = {
                    ClientId: iClientId,
                    UserId: iUserId,
                    type: "getentryDataM",
                };
                const response = await Make(data)
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
    const onChangeSearchPlant = (query) => {
        try {
            if (query) {
                const newData = plantListItems.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setPlantData(newData);
                setPlantSearch(query);
            } else {
                setPlantData(plantListItems);
                setPlantSearch(query);
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
            type: 'getPlantList'

        };
        const response = await Make(data)
        var datas = await response.json();
        setPlantData(datas);
        setPlantListItems(datas);
    }
    const actionOnRowPlant = async (item) => {
        setPlantName(item.Name);
        setPlantModalVisible(false);
        var iPlantId = item.Id;
        setPlantId(iPlantId);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            PlantId: iPlantId,
            type: 'getProductList'

        };
        const response = await Make(data)
        var datas = await response.json();
        setProductData(datas)
         console.log(`%c[stackoverflow] postAnswer()`, datas);
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
    function plantHandleChange() {
        setPlantModalVisible(false)
    }
    function assethandleChange() {
        setAssetModalVisible(false)
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
    function submitform() {
        if (submitClick == true) return;
        setsubmitClick(true);
        if (ccId == 0) {
            setsubmitClick(false);
            alert("Select From Costcentre");
            return;
        }
        if (productId == 0) {
            setsubmitClick(false);
            alert("Select Product");
            return;
        }
        if (productList.length == 0) {
            setsubmitClick(false);
            alert("Select Product");
            return;
        }
        let bQtyFound = false;
        for (var trans of productList) {
            if (CommonFun.FloatVal(trans['Qty']) != 0) {
                bQtyFound = true;
                break;
            }
        }
        if (bQtyFound == false) {
            setsubmitClick(false);
            alert("No Production Qty Entered")
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
            setAssetListItems(tempTrans);
            setAssetData(tempTrans);
        }
        let tmptrans = [...transferTrans];
        let index = tmptrans.findIndex(el => el.RequestId === argId);
        if (index !== -1) {
            tmptrans.splice(index, 1);
            setTransferTrans(tmptrans);
        }
    }
    const getRequestList = async (argValue) => {
        let index = productData.findIndex(el => el.Id === argValue);
        let sproductName = productData[index]['Name'];
        setProductName(sproductName);
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                PCostCentreId: ccId,
                ProductId: argValue,
                type: "getRequestListM",
            };
            const response = await Make(data);
            const datas = await response.json();
            setAssetData(datas.requestList);
            setAssetListItems(datas.requestList);
            setMAssetData(datas.requestList);
            setProductId(argValue);
            setProductList(datas.productList);
            setProductAnal(datas.analList);
            setproductTheo(datas.arrThe);
            if (datas.requestList.length > 0) {
                setEditPQty(false);
                setReference(true);
            } else {
                setEditPQty(true);
                setReference(false);
            }
        } catch (error) {
            console.log(error)
        }
    }
    function calculateProdQty() {
        var dTotQty = 0;
        if (crusher == 0) {
            if (transferTrans.length > 0) {
                transferTrans.map((item) => {
                    dTotQty = dTotQty + CommonFun.FloatVal(item.Qty);
                });
                updateProductQty(dTotQty.toString(), productId);
            }
        }
    }
    function calculateTotProdQty() {
        var dTotQty = 0;
        productList.map((item) => {
            dTotQty = dTotQty + CommonFun.FloatVal(item.Qty);
        });
        setTotProducedQty(dTotQty, productId);
    }
    function calculateProdAmt() {
        var dTotAmt = 0;
        productAnal.map((item) => {
            dTotAmt = dTotAmt + CommonFun.FloatVal(item.Amount);
        });
        setProductAmt(dTotAmt);
    }
    function showAssetList() {
        if (transferTrans.length > 0 || RegisterId != 0) {
            wizard.current.next();
        } else {
            if (ccId == 0) {
                alert("Select From CostCentre");
                return;
            }
            if (assetData.length == 0) wizard.current.next();
            else setAssetModalVisible(true);
        }
    }
    const updateData = async () => {
        let dstartTime = Moment(startTime).format('YYYY-MMM-DD HH:mm:ss');
        let dendTime = Moment(endTime).format('YYYY-MMM-DD HH:mm:ss');
        try {
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                RegisterId: RegisterId,
                PCostCentreId: ccId,
                PlantId: plantId,
                ProductId: productId,
                trans: transferTrans,
                productAnal: productAnal,
                productList: productList,
                productAmt: productAmt,
                totProducedQty: totProducedQty,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                startTime: dstartTime,
                endTime: dendTime,
                type: "updateMakeM",
            };
            const response = await Make(data);
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
                type: "getProductdataM",
            };
            const response = await Make(data);
            const datas = await response.json();
            let tempTrans = [...transferTrans];
            tempTrans.push(...datas);
            setTransferTrans(tempTrans);
        } catch (error) {
            console.log(error)
        }
    }
    function updateProductQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...productList];
        let index = tmptrans.findIndex(el => el.ProductId === argId);
        if (index !== -1) {
            tmptrans[index] = { ...tmptrans[index], Qty: dQty };
        }
        setProductList(tmptrans);
        updateTheoritical(dQty);
    }
    function updateTheoritical(argQty) {
        productAnal.map((item) => {
            let iResId = item.ResourceId;
            let tmptrans = [...productTheo];
            let index = tmptrans.findIndex(el => el.ResourceId === iResId);
            if (index !== -1) {
                let dTheQty = CommonFun.FloatVal(tmptrans[index]['TheoriticalQty']);
                let dQty = dTheQty * CommonFun.FloatVal(argQty);
                item.TheoriticalQty = dQty;
            } else {
                item.TheoriticalQty = 0;
            }
            //updateMakeQty(dQty,iResId);
        });
    }
    function updateMakeQty(argValue, argId) {
        let dQty = argValue;
        let tmptrans = [...productAnal];
        let index = tmptrans.findIndex(el => el.ResourceId === argId);
        let dStockQty = CommonFun.FloatVal(tmptrans[index]['StockQty']);
        let dRate = CommonFun.FloatVal(tmptrans[index]['Rate']);
        if (CommonFun.FloatVal(dQty) > dStockQty) {
            alert("Qty greater than stock Qty");
            dQty = 0;
        }
        let dAmt = dQty * dRate;
        tmptrans[index] = { ...tmptrans[index], UsedQty: dQty };
        tmptrans[index] = { ...tmptrans[index], Amount: dAmt };
        setProductAnal(tmptrans);
    }
    function goNext() {
        if (currentStep == 0) {
            if (reference == true && RegisterId == 0) showAssetList();
            else wizard.current.next();
        } else {
            wizard.current.next();
        }
    }
    function hideDatePickerFrom() {
        setShowFromTime(false);
    }
    function handleConfirmFrom(argValue) {
        if (new Date(argValue) > new Date(endTime)) {
            alert("Start Time greater than End Time");
            setShowFromTime(false);
        } else {
            setStartTime(argValue);
            setShowFromTime(false);
        }
    }
    function hideDatePickerEnd() {
        setShowEndTime(false);
    }
    function handleConfirmEnd(argValue) {
        if (new Date(startTime) > new Date(argValue)) {
            alert("End Time less than Start Time");
            setShowEndTime(false);
        } else {
            setEndTime(argValue);
            setShowEndTime(false);
        }
    }

    //  console.log(productData, '<<<<<<<productData >>>>>>>>>');
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
            <View style={styles.flatlist}>
                <Text style={styles.labeltxt}>Plant Name</Text>
                <View style={styles.centeredView} pointerEvents={seldisabled}>
                    <SPickList visible={plantModalVisible} data={plantData} onChange={plantHandleChange} onChangeSearch={onChangeSearchPlant} search={plantSearch} actionOnCancel={setPlantModalVisible} actionOnRow={actionOnRowPlant} />
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setPlantModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>{plantName ? plantName : 'Select Plant'}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Product Name</Text>
                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height: 50, paddingBottom: 5, paddingTop:15, paddingLeft:10}}  pointerEvents={seldisabled}>
                            { Platform.OS =='android' ?
                            <Picker
                                style={{ height: 50, width: '100%', borderWidth: 1, }}
                                mode="dropdown"
                                selectedValue={productId}
                                onValueChange={(itemValue, itemIndex) => getRequestList(itemValue)}
                            >
                                {productData.map((key) => {
                                    return (<Picker.Item label={key.Name} value={key.Id} key={key.Id} />)
                                })}
                            </Picker>
                                  :
                                        <RNPickerSelect
                                            selectedValue={productId}
                                            style={{ height: 50, width: '100%', borderWidth: 1, }}
                                            placeholderTextColor='#cccc'
                                            items={productData.map((y) => {
                                                return { label: y.Name, value: y.Id ,key:y.Id }; 
                                              })}
                                            onValueChange={(itemValue, itemIndex) => getRequestList(itemValue)}>

                                        </RNPickerSelect>
                                }
                            
                        </View>
                    </View>
                </View>
            </View>


            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>Start Time</Text>

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
            </View>

            <View style={styles.row1.mtxttop}>
                <View style={{ width: '97%', marginLeft: '2.5%', marginRight: '0%', }}>
                    <View style={styles.pickerView}>
                        <Text style={styles.labeltxt}>End Time</Text>

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


            <MPickList visible={assetModalVisible} data={assetData} onChange={assethandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetModalVisible} actionOnRow={actionOnRowAsset} />
        </View>
    }, {
        content: <View style={{ minwidth: '100%', height: '95%', }} >
            <View style={styles.flatlist}>
                <View style={styles.row}>
                    {productList.map((item) => (
                        <TouchableOpacity style={styles.touch}>
                            <View style={styles.Flatlistview}>
                                <View style={styles.col3}>
                                    <Text style={[styles.labeltxt, { marginTop: 10, }]} >{item.ProductName}</Text>
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}>:</Text>
                                </View>
                                <View style={styles.col3}>
                                    {editPQty === true ?
                                        <TextInput
                                            style={styles.input}
                                            value={item.Qty ? item.Qty.toString() : ''}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            onChangeText={text => updateProductQty(text, item.ProductId)}
                                            editable={editPQty}
                                        />
                                        :
                                        <TextInput
                                            style={styles.input}
                                            value={CommonFun.numberDigit(parseFloat(item.Qty), 3)}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            onChangeText={text => updateProductQty(text, item.ProductId)}
                                            editable={editPQty}
                                        />
                                    }
                                </View>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle}></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* <FlatList style={[styles.flatlist, { marginTop: 10, }]}
                data={productList}
                keyExtractor={item => item.ProductId}
                renderItem={({ item, index }) => {
                    return <View  ><TouchableOpacity style={styles.touch}>
                        <View style={styles.Flatlistview}>
                            <View style={styles.col3}>
                                <Text style={styles.labeltxt} >{item.ProductName}</Text>
                            </View>
                            <Text style={styles.colon}>: </Text>
                            <View style={styles.col3}>
                                <TextInput
                                    style={styles.input}
                                    value={item.Qty}
                                    keyboardType="numeric"
                                    maxLength={10}
                                    onChangeText={text => updateProductQty(text, item.ProductId)}
                                    editable={editPQty}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                    </View>
                }}
            /> */}
            <View style={reference == true ? styles.inputContainer2 : styles.hide}>
                <TouchableOpacity onPress={() => setAssetAddModalVisible(true)}>
                    <MPickList visible={assetAddModalVisible} data={assetData} onChange={AssetAddhandleChange} onChangeSearch={onChangeSearchAsset} search={assetSearch} actionOnCancel={setAssetAddModalVisible} actionOnRow={actionOnRowAssetAdd} />
                    <View style={styles.btnContainernewbtn}>
                        <Icon name='add' size={20} color='#ffff' />
                        <Text style={{ color: '#ffff' }}>Add Reference</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <ScrollView> */}
                <View style={{ marginBottom: 50, }}>
                    <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                        data={transferTrans}
                        keyExtractor={item => item.RequestId}
                        renderItem={({ item, index }) => {
                            return <View  ><TouchableOpacity style={styles.touch}>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col7}>
                                        <Text style={styles.itemTitle2}> {item.RequestNo}</Text>
                                    </View>
                                    <View style={approve == 'Y' ? styles.hide : styles.deleteicon}>
                                        <TouchableOpacity onPress={() => deleteRow(item.RequestId)}>
                                            {/* <Text style={styles.deletetext}>Delete</Text> */}
                                            <Icon name='delete' size={25} color='red' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.marg5, { height: 0, borderBottomWidth: 1, borderBottomColor: "#d0d2d9" }]}>
                                </View>
                                <View style={styles.Flatlistview}>
                                    <View style={styles.col3}>
                                        <Text style={styles.availableQty} >Dispatch Qty:</Text>
                                    </View>
                                    <View style={styles.colw25}>
                                        <Text style={styles.itemti}> {CommonFun.numberDigit(parseFloat(item.DispatchQty), 3)}</Text>
                                    </View>
                                    <View style={styles.colw25}>
                                        <Text style={styles.availableQty}>Qty:</Text>
                                    </View>
                                    <View style={styles.colw25}>
                                        <TextInput
                                            style={styles.inputqty}
                                            value={item.Qty}
                                            keyboardType="numeric"
                                            maxLength={10}
                                            // onChangeText={text => checkQty(text, userData.RequestId)}
                                            editable={false}
                                        />
                                    </View>
                                    <View style={styles.col18}>
                                        <Text style={[styles.itemunit, { marginRight: 10, }]} >{item.UnitName}</Text>
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
            <View style={styles.Flatlistview}>
                <View style={styles.col3}>
                    <Text style={[styles.labeltxt, { marginTop: 10, }]} >Total Production Amount</Text>
                </View>
                <View style={styles.colw25}>
                    <Text style={styles.itemtittle}>:</Text>
                </View>
                <View style={styles.col3}>
                    <TextInput
                        style={styles.input}
                        value={CommonFun.numberDigit(parseFloat(productAmt), 2)}
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
                <FlatList style={[styles.flatlist, { marginTop: 10 }]}
                    data={productAnal}
                    keyExtractor={item => item.ResourceId}
                    renderItem={({ item, index }) => {
                        return <View  ><TouchableOpacity style={styles.touch}>
                            <View style={[styles.Flatlistview, { height: 25, borderBottomWidth: 1, borderBottomColor: "#d0d2d9", }]}>
                                <Text style={{ textAlign: 'center', width: '100%', color: FONTCOLORS.primary, fontSize: 15, }} >{item.ResourceName} ({item.UnitName})</Text>
                            </View>
                            <View style={[styles.Flatlistview, { height: 30, }]}>
                                <View style={styles.col28}>
                                    <Text style={styles.itemtittle} >Theoritical Qty</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col28}>
                                    <Text style={styles.assetname} >
                                        {CommonFun.numberDigit(parseFloat(item.TheoriticalQty), 3)}</Text>
                                </View>
                                {/* </View>
                        <View style={styles.Flatlistview} > */}
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle} >Stock Qty</Text>
                                </View>
                                <Text style={styles.colon}>: </Text>
                                <View style={styles.col28}>
                                    <Text style={styles.assetname} >
                                        {CommonFun.numberDigit(parseFloat(item.StockQty), 3)}</Text>
                                </View>
                            </View>
                            <View style={[styles.Flatlistview, { height: 30, }]}>
                                <View style={styles.colw25}>
                                    <Text style={styles.itemtittle1} >Qty</Text>
                                </View>
                                <View style={styles.col3}>
                                    <Text style={styles.itemtittle1} >Rate</Text>
                                </View>
                                <View style={styles.col3}>

                                    <Text style={[styles.itemtittle1, { textAlign: 'center' }]} >Amount</Text>
                                </View>
                            </View>
                            <View style={styles.Flatlistview}>
                                <View style={styles.colw25}>
                                    <TextInput
                                        style={styles.input2}
                                        value={item.UsedQty ? item.UsedQty.toString() : ''}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        onChangeText={text => updateMakeQty(text, item.ResourceId)}
                                        editable={approve == 'Y' ? false : true}
                                    //editable={false}
                                    />
                                </View>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.inputrate}
                                        value={CommonFun.numberDigit(parseFloat(item.Rate), 2)}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        // onChangeText={text => updateProductQty(text, item.ResourceId)}
                                        editable={false}
                                    />
                                </View>
                                <View style={styles.col3}>
                                    <TextInput
                                        style={styles.inputamt}
                                        value={CommonFun.numberDigit(parseFloat(item.Amount), 2)}
                                        keyboardType="numeric"
                                        maxLength={10}
                                        // onChangeText={text => updateProductQty(text, item.ResourceId)}
                                        editable={false}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        </View>
                    }}
                />
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
                <Text style={{ marginTop: 5, marginBottom: 5, }}>Step {currentStep + 1}. of 4</Text>
                <Button disabled={isLastStep} title="Next" color={COLORS.primary} onPress={() => goNext()} />
            </View>
            <View style={{ width: '100%' }}>
                <Wizard style={{}}
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
export default MakeEntry;
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
        borderBottomWidth: 1,
        padding: 2,
        width: '30%',
        marginRight: '55%',
        borderBottomColor: COLORS.brdleftblue,
        textAlign: 'right',
    },
    inputqty: {
        height: 35,
        borderBottomWidth: 1,
        padding: 2,
        width: '75%',
        marginRight: '55%',
        borderBottomColor: COLORS.brdleftblue,
        textAlign: 'right',
        color: 'black',
        // paddingLeft:18,
    },
    input2: {
        height: 35,
        borderBottomWidth: 1,
        padding: 2,
        width: '80%',
        marginRight: '55%',
        borderBottomColor: COLORS.brdleftblue,
        textAlign: 'right',
        color: 'black',
        // paddingLeft:18,
    },
    inputrate: {
        height: 35,
        padding: 10,
        width: '80%',
        marginRight: '55%',
        color: 'black'
    },
    inputamt: {
        height: 35,
        padding: 10,
        width: '90%',
        marginRight: '56%',
        color: 'black',
        textAlign: 'right',
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
        borderColor: COLORS.brdleftblue
    },
    touch: {


        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 7,
        marginBottom: 1,
        padding: 5,
        justifyContent: 'flex-start',
        //      borderWidth: 2,
        //      borderColor: "#fcfcfc",
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
        elevation: 4,
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
        maxWidth: '65%',
        alignItems: "center",
        justifyContent: "center",
    },
    itemtittle: {
        textAlign: 'left',
        padding: 2,
        fontSize: 14,
        paddingTop: 10,
        color: '#5c6773',
    },
    itemunit: {
        textAlign: 'left',
        padding: 2,
        fontSize: 14,
        paddingTop: 10,
        color: '#5c6773',
    },
    itemti: {
        // textAlign: 'center',
        padding: 2,
        fontSize: 14,
        paddingTop: 10,
        color: 'black',
        // marginLeft: 10,
    },
    itemtittle1: {
        // textAlign: 'center',
        padding: 2,
        fontSize: 14,
        paddingTop: 10,
        color: '#5c6773',
        marginLeft: 10,
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
    itemTitlehead: {
        //color: '#ED0054',
        color: '#003885',
        textAlign: 'right',
        fontSize: 15
    },
    colon: {
        paddingTop: 10,
        width: '1%',
    },
    assetname: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 10,
    },
    inputContainer2: {
        paddingTop: 1,
        width: "49%",
        margin: 1,
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
    col3: {
        width: '29%',
    },
    col28: {
        width: '28%',
    },
    col7: {
        width: '82%',
    },
    colw25: {
        width: '20%',
    },
    col18: {
        width: '23%',
    },
    col40: {
        width: '40%',
    },
    col10: {
        width: '10%',
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
        color: '#5c6773',
        // fontWeight: 'bold',
        fontSize: 14,
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
        // margin: 2,
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

    col48: {
        width: '48%',
    },
    textInput: {
        color: 'black'
    },

    datePickerStyle: {  
        width: '100%',
    }
})