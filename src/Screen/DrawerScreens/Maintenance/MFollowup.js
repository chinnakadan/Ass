import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { Text, View, StyleSheet, Pressable, FlatList, TouchableOpacity, Alert, Modal, Button, TextInput, BackHandler, ScrollView , Platform} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import Label, { Orientation } from "react-native-label";
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const MFollowup = (props) => {
    const { ShTransId, TicketId } = props.route.params;
    const [ClientId, setClientId] = useState('');
    const [UserId, setUserId] = useState('');
    const [vendorList, setvendorList] = useState([]);
    const [vendordata, setvendorData] = useState([]);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [followupType, setfollowupType] = React.useState("1");
    const [vendorId, setVendorId] = useState('0');
    const [compDate, setcompDate] = useState(new Date());
    const [contactPerson, setcontactPerson] = useState('');
    const [contactNo, setcontactNo] = useState('');
    const [serviceBy, setserviceBy] = React.useState("I");
    const [serviceType, setserviceType] = React.useState("1");
    const [takenOutside, settakenOutside] = React.useState("0");
    const [takenOn, settakenOn] = useState(new Date());
    const [takenTo, settakenTo] = useState('');
    const [takenInside, settakenInside] = React.useState("0");
    const [inwardOn, setinwardOn] = useState(new Date());
    const [billCovered, setbillCovered] = React.useState("1");
    const [remarks, setRemarks] = React.useState("");
    const pickerRef = useRef();
    const [AssetName, setAssetName] = useState('');
    const [AssetId, setAssetId] = useState(0);
    const [VendorName, setVendorName] = useState('');
    const [isOutSide, setisOutSide] = useState('');
    const [submitClick, setsubmitClick] = useState(false);
    const [gLatitude, setgLatitude] = useState(0);
    const [gLongitude, setgLongitude] = useState(0);
    const [gLocation, setgLocation] = useState('');
    useEffect(() => {
        if (AssetId == 0) retrieveData();
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
                ShTransId: ShTransId,
                TicketId: TicketId,
                type: "getFollowup",
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            setAssetName(datas.AssetName);
            setAssetId(datas.AssetId);
            setvendorList(datas.Vendor);
            setvendorData(datas.Vendor);
            setisOutSide(datas.isOutSide);
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
                const newData = vendorList.filter(
                    function (item) {
                        const itemData = item.Name
                            ? item.Name.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setvendorData(newData);
                setSearch(query);
            } else {
                setvendorData(vendorList);
                setSearch(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const actionOnRow = (item) => {
        setVendorId(item.Id);
        setVendorName(item.Name);
        setModalVisible(false);
    }
    function handleChange() {
        // Here, we invoke the callback with the new value
        setModalVisible(false)
    }
    function submitform() {
        // if (CostcentreId == 0) {
        //     alert("Select Costcentre");
        //     return;
        // }
        // if (AssetId == 0) {
        //     alert("Select Asset");
        //     return;
        // }
        if (submitClick == true) return;
        setsubmitClick(true);
        setLoading(true);
        updateData();
    }
    const updateData = async () => {
        try {
            if (followupType == 1) {
                if (serviceBy == 'I') {
                    setVendorId(0);
                } else {
                    setserviceType(0);
                }
                setbillCovered(0);
            } else {
                settakenOutside(0);
                settakenTo('');
                if (serviceBy == 'I') {
                    setVendorId(0);
                } else {
                    setserviceType(0);
                }
            }
            let mcompDate = Moment(compDate, 'DD-MM-YYYY')
            let dcompDate = Moment(mcompDate).format('YYYY-MMM-DD');

            let mtakenOn = Moment(takenOn, 'DD-MM-YYYY')
            let dtakenOn = Moment(mtakenOn).format('YYYY-MMM-DD');

            let minwardOn = Moment(inwardOn, 'DD-MM-YYYY')
            let dinwardOn = Moment(minwardOn).format('YYYY-MMM-DD')
            let data = {
                ClientId: ClientId,
                UserId: UserId,
                ShTransId: ShTransId,
                TicketId: TicketId,
                followupType: followupType,
                serviceBy: serviceBy,
                serviceType: serviceType,
                vendorId: vendorId,
                compDate: dcompDate,
                contactPerson: contactPerson,
                contactNo: contactNo,
                takenOutside: takenOutside,
                takenOn: dtakenOn,
                takenTo: takenTo,
                takenInside: takenInside,
                inwardOn: dinwardOn,
                billCovered: billCovered,
                remarks: remarks,
                gLocation: gLocation,
                gLatitude: gLatitude,
                gLongitude: gLongitude,
                type: "updatefollowup",
            };
            const response = await Maintentance(data);
            const datas = await response.json();
            if (datas.Status === "Success") {
                if (ShTransId != 0) props.navigation.push('MaintenanceNotification');
                else props.navigation.push('TicketView');
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
                <ScrollView>
                    <View style={styles.Flatlistview} >
                        <Text style={styles.itemTitlehead} >{AssetName}</Text>
                    </View>
                    <View style={styles.row1}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Followup Type</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%" ,height:50, paddingLeft:10, paddingTop:15  }}>
                                    
                                    { Platform.OS == 'android' ?
                                    <Picker
                                        selectedValue={followupType}
                                        style={{ height: 50, width: '100%', }}
                                        onValueChange={(itemValue, itemIndex) => setfollowupType(itemValue)}
                                    >
                                        <Picker.Item label="Response" value="1" />
                                        <Picker.Item label="Closed" value="2" />
                                    </Picker>
                                     : 
                                     <RNPickerSelect 
                                      selectedValue={followupType}
                                      style={{ height: 50, width: '100%', }}
                                      onValueChange={(itemValue, itemIndex) => setfollowupType(itemValue)}
                                      items={[
                                        {label:'Response' , value:'1'},
                                        {label:'Closed' , value:'2'}
                                      ]}></RNPickerSelect>
                                    }
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={styles.row1}>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Service by</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:50, paddingLeft:10,paddingTop:15  }}>
                                { Platform.OS == 'android' ?
                                       <Picker
                                       selectedValue={serviceBy}
                                       style={{ height: 50, width: '100%' }}
                                       onValueChange={(itemValue, itemIndex) => setserviceBy(itemValue)}
                                   >
                                       <Picker.Item label="Internal" value="I" />
                                       <Picker.Item label="External" value="E" />
                                   </Picker>
                                     : 
                                     <RNPickerSelect 
                                      selectedValue={serviceBy}
                                      style={{ height: 50, width: '100%', }}
                                      onValueChange={(itemValue, itemIndex) => setserviceBy(itemValue)}
                                      items={[
                                        {label:'Internal' , value:'I'},
                                        {label:'External' , value:'E'}
                                      ]}></RNPickerSelect>
                                    }
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={serviceBy == 'I' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>

                                <Text style={styles.labeltxt}>Type of Service</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:50, paddingLeft:10, paddingTop:15  }}>
                                { Platform.OS == 'android' ?
                                    <Picker
                                    selectedValue={serviceType}
                                    style={{ height: 50, width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => setserviceType(itemValue)}
                                >
                                    <Picker.Item label="Spare Replace" value="1" />
                                    <Picker.Item label="Labour Only" value="2" />
                                    <Picker.Item label="Asset Replace" value="3" />
                                </Picker>
                                     : 
                                     <RNPickerSelect 
                                      selectedValue={serviceType}
                                      style={{ height: 50, width: '100%', }}
                                      onValueChange={(itemValue, itemIndex) => setserviceType(itemValue)}
                                      items={[
                                        {label:'Spare Replace' , value:'1'},
                                        {label:'Labour Only' , value:'2'},
                                        {label:'Asset Replace' , value:'3'}
                                      ]}></RNPickerSelect>
                                    }
                                   
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={serviceBy == 'E' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt1}>Agency Name</Text>
                                <View style={styles.centeredView}>
                                    <SPickList visible={modalVisible} data={vendordata} onChange={handleChange} onChangeSearch={onChangeSearch} search={search} actionOnCancel={setModalVisible} actionOnRow={actionOnRow} />
                                    <Pressable
                                        style={[styles.button, styles.buttonOpen]}
                                        onPress={() => setModalVisible(true)}
                                    >
                                        <Text style={styles.textStyle}>{VendorName ? VendorName : 'Select Agency'}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Expected Date of Completion</Text>
                                <DatePicker
                                    date={compDate} // Initial date from state
                                    style={styles.datePickerStyle}

                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="DD-MM-YYYY"

                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
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
                                    onDateChange={(date) => {
                                        setcompDate(date);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Contact Person</Text>
                                <TextInput
                                    label="Contact Person"
                                    style={styles.input}
                                    onChangeText={setcontactPerson}
                                    value={contactPerson}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Contact No</Text>
                                <TextInput
                                    label="Contact No"
                                    style={styles.input}
                                    onChangeText={setcontactNo}
                                    value={contactNo}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={isOutSide == 0 && followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>

                                <Text style={styles.labeltxt}>Taken OutSide?</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:50, paddingLeft:10, paddingTop:15 }}>
                                { Platform.OS == 'android' ?
                                     <Picker
                                     selectedValue={takenOutside}
                                     style={{ height: 50, width: '100%' }}
                                     onValueChange={(itemValue, itemIndex) => settakenOutside(itemValue)}
                                 >
                                     <Picker.Item label="No" value="0" />
                                     <Picker.Item label="Yes" value="1" />
                                 </Picker>
                                     : 
                                     <RNPickerSelect 
                                     selectedValue={takenOutside}
                                     style={{ height: 50, width: '100%' }}
                                     onValueChange={(itemValue, itemIndex) => settakenOutside(itemValue)}
                                      items={[
                                        {label:'No' , value:'0'},
                                        {label:'Yes' , value:'1'},
                                      ]}></RNPickerSelect>
                                    }
                                 
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={isOutSide == 0 && takenOutside == '1' && followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Taken on</Text>
                                <DatePicker
                                    date={takenOn} // Initial date from state
                                    style={styles.datePickerStyle}

                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="DD-MM-YYYY"

                                    //   maxDate="01-01-2019"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"

                                    customStyles={{
                                        dateIcon: {
                                            //display: 'none',
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
                                    onDateChange={(date) => {
                                        settakenOn(date);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={isOutSide == 0 && takenOutside == '1' && followupType == '1' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Taken To</Text>
                                <TextInput
                                    label="Taken To"
                                    style={styles.input}
                                    onChangeText={settakenTo}
                                    value={takenTo}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={isOutSide == 1 ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Taken InSide?</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:50, paddingLeft:10, paddingTop:15 }}>
                                { Platform.OS == 'android' ?
                                     <Picker
                                     selectedValue={takenInside}
                                     style={{ height: 50, width: '100%' }}
                                     onValueChange={(itemValue, itemIndex) => settakenInside(itemValue)}
                                 >
                                     <Picker.Item label="No" value="0" />
                                     <Picker.Item label="Yes" value="1" />
                                 </Picker>
                                     : 
                                     <RNPickerSelect 
                                     selectedValue={takenInside}
                                     style={{ height: 50, width: '100%' }}
                                     onValueChange={(itemValue, itemIndex) => settakenInside(itemValue)}
                                      items={[
                                        {label:'No' , value:'0'},
                                        {label:'Yes' , value:'1'},
                                      ]}></RNPickerSelect>
                                    }
                                  
                                </View>

                            </View>
                        </View>
                    </View>
                    <View style={takenInside == 1 && isOutSide == 1 ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Inward On</Text>
                                <DatePicker
                                    date={inwardOn} // Initial date from state
                                    style={styles.datePickerStyle}
                                    mode="date" // The enum of date, datetime and time
                                    placeholder="select date"
                                    format="DD-MM-YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"

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
                                    onDateChange={(date) => {
                                        setinwardOn(date);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={followupType == '2' && serviceBy == 'E' ? styles.row1 : styles.hide}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Bill Covered By</Text>
                                <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height:40, paddingLeft:10,paddingTop:15  }}>
                                { Platform.OS == 'android' ?
                                   <Picker
                                   selectedValue={billCovered}
                                   style={{ height: 50, width: '100%' }}
                                   onValueChange={(itemValue, itemIndex) => setbillCovered(itemValue)}
                               >
                                   <Picker.Item label="Fully Paid" value="1" />
                                   <Picker.Item label="Fully by AMC" value="2" />
                                   <Picker.Item label="Partially by AMC" value="3" />
                               </Picker>
                                     : 
                                     <RNPickerSelect 
                                     selectedValue={billCovered}
                                   style={{ height: 50, width: '100%' }}
                                   onValueChange={(itemValue, itemIndex) => setbillCovered(itemValue)}
                                      items={[
                                        {label:'Fully Paid' , value:'1'},
                                        {label:'Fully by AMC' , value:'2'},
                                        {label:'Partially by AMC' , value:'3'},
                                      ]}></RNPickerSelect>
                                    }
                                 
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={styles.row1}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputContainer.pickerView}>
                                <Text style={styles.labeltxt}>Remarks</Text>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={10}
                                    label="Remarks"
                                    style={styles.inputremarks}
                                    onChangeText={setRemarks}
                                    value={remarks}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.btnContainer} onPress={() => submitform()}>
                            <Text style={styles.previewtxt}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
export default MFollowup;
const styles = StyleSheet.create({
    mtop: {
        marginTop: 10,
        width: '98%',
        marginLeft: '1%',
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
    labeltxt: {
        color: FONTCOLORS.primary,
        fontWeight: 'bold'
    },
    labeltxt1: {
        color: FONTCOLORS.primary,
        marginLeft: 3,
        fontWeight: 'bold'
    },
    input: {
        height: 50,
        borderWidth: 1,
        padding: 10,
        borderColor: COLORS.brdleftblue
    },
    button: {
        padding: 10,
        margin: 0,
        backgroundColor: 'transparent',

        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        height: 50,
        // marginLeft: 2,
    },
    itemTitle: {
        color: 'black',
        paddingBottom: 10,
        fontWeight: 'bold',
    },
    flatlist: {
        fontSize: 20,
        padding: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    itemTitle1: {
        flex: 0,
        color: 'black',
        // height: 30,
        fontWeight: 'bold',
        paddingLeft: 5,
        textAlign: 'left'
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
        // margin: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
    },
    previewtxt:
    {
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
        marginTop: '2%',
        marginBottom: '2%',
        marginLeft: '35%',
        alignItems: "center",
        justifyContent: "center",
    },
    itemtittle:
    {
        color: 'black',
        textAlign: 'left',
        padding: 2,
        fontSize: 15
    },
    row1: {
        margin: 2,
        marginTop: 2,
        flexDirection: "row",
        flexWrap: "wrap",

        PaddingBottom: 10,
    },
    inputContainer: {
        paddingTop: 1,
        width: "98%",
        marginLeft: '1%',
        marginRight: '1%',
    },
    itemTitlehead:
    {
        color: 'green',
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold'
    },
    datePickerStyle: {
        width: '100%',
        padding: 1,
        paddingTop: 6,
        borderWidth: 0,
    },
    pickerView: {
        width: "98%",
        // margin: '1%',
    },
    textStyle:
    {
        color: 'black',
    }
})