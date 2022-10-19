import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Pressable, BackHandler, Switch, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Moment from 'moment';
import { Maintentance } from '../../../service/api/apiservice';
import MonthPicker from 'react-native-month-year-picker';
import Loader from '../../Components/Loader';
import SPickList from '../../Components/sPickList';
import { Icon } from 'react-native-elements';
import CommonFun from '../../Components/CommonFun';
import { COLORS, FONTCOLORS } from '../../theme/theme';
import RNPickerSelect from 'react-native-picker-select';

const Amc = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [entryType, setentryType] = useState('1');

    const [listItems, setlistItems] = useState([]);
    const [Data, setData] = useState([]);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const [pickerItems, setPickerItems] = useState([{ id: 1, name: "Amc", value: 1 }
        , { id: 2, name: "Insurance", value: 2 }, { id: 3, name: "Warranty", value: 3 }]);

    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const [refDate, setRefDate] = useState(new Date());
    const [switchValue, setSwitchValue] = useState(true);
    const [radd, setrAdd] = useState(0);
    useEffect(() => {
        if (Data.length == 0) retrieveData();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }
    const retrieveData = async () => {
        let iClientId = await AsyncStorage.getItem('clientId');
        let iUserId = await AsyncStorage.getItem('userId');
        setClientId(iClientId);
        setUserId(iUserId);
        let iMonth = refDate.getMonth() + 1
        let iYear = refDate.getFullYear();
        loadData(iMonth, iYear, entryType);
    }
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
    const loadData = async (argMonth, argYear, argType) => {
        if (ClientId == 0 || UserId == 0) return;
        setLoading(true);
        let data = {
            ClientId: ClientId,
            UserId: UserId,
            Month: argMonth,
            Year: argYear,
            EntryType: argType,
            type: 'getAmc'

        };
        const response = await Maintentance(data)
        var datas = await response.json();
        setData(datas.regList);
        setlistItems(datas.regList);
        setrAdd(datas.add);
        setLoading(false);
    }
    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || refDate;
            showPicker(false);
            setRefDate(selectedDate);
            let iMonth = selectedDate.getMonth() + 1
            let iYear = selectedDate.getFullYear();
            loadData(iMonth, iYear, entryType);
        },
    );
    function changeentryType(argType) {
        setentryType(argType);
        // setentryType(argType);
        let iMonth = refDate.getMonth() + 1
        let iYear = refDate.getFullYear();
        loadData(iMonth, iYear, argType);
    }
    function editEntry(item) {
        props.navigation.push('AmcEntry', { RegisterId: item.RegId, RenewalType: entryType });
    }
    return (
        <>
            <Loader loading={loading} />
            <View style={styles.container}>
                <View style={[styles.Flatlistview1, { height: 30, }]}>
                    <View style={styles.col60}>
                    </View>
                    <View style={[styles.col15]}>
                        <Text style={{ textAlign: 'right', color: FONTCOLORS.primary, fontWeight: 'bold', marginTop: 4, }}>
                            {switchValue ? 'Filter on' : 'Filter off'}
                        </Text>
                    </View>
                    <View style={[styles.col20, style = { marginRight: 15 }]}>
                        <Switch
                            style={{ marginTop: 0 }}
                            onValueChange={(itemValue) => setSwitchValue(itemValue)}
                            value={switchValue}
                        />
                    </View>
                </View>
                <View>
                    <View style={switchValue == true ? '' : styles.hide}>
                        <View style={[styles.row, { width: '100%' }]}>

                            <View >
                                <Text style={{ color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }}>Type</Text>
                                <View style={{ width: '98%', marginTop: 5, marginHorizontal: '1%' }}>
                                    <View style={styles.pickerView}>
                                        <View style={{ borderWidth: 1, borderColor: COLORS.brdleftblue, width: "100%", height: 50, paddingBottom: 5, paddingTop: 15, paddingLeft: 10 }} >
                                            <RNPickerSelect
                                                onValueChange={(itemValue, itemIndex) => changeentryType(itemValue)}
                                                selectedValue={entryType}

                                                items={pickerItems?.map((item) => ({
                                                    key: item.id,
                                                    label: item.name,
                                                    value: item.value
                                                }),
                                                )}

                                            >
                                            </RNPickerSelect>
                                            {/* <Picker
                                                    selectedValue={entryType}
                                                    style={{}}
                                                    onValueChange={(itemValue, itemIndex) => changeentryType(itemValue)}
                                                >
                                                    <Picker.Item label="Amc" value="1" />
                                                    <Picker.Item label="Insurance" value="2" />
                                                    <Picker.Item label="Warranty" value="3" />
                                                </Picker> */}
                                        </View>
                                    </View>
                                </View>


                            </View>

                            <View >
                                <Text style={{ color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }}>Month</Text>

                                <View style={[styles.Flatlistview2, { height: 70, marginTop: show == false ? 5 : 150 }]}>
                                    <View style={styles.pickerView}>
                                        <TouchableOpacity onPress={() => showPicker(true)}>
                                            <Text style={styles.textInput} > {Moment(refDate).format('MMMM YYYY')}</Text>
                                        </TouchableOpacity>
                                        {show && (
                                            <MonthPicker
                                                onChange={onValueChange}
                                                changeDate
                                                value={refDate}
                                                locale="en"
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.MainContainer}>
                        {/* <ScrollView> */}
                                <View style={styles.container}>
                                <View style={styles.searchview}>
                                    <Searchbar style={styles.modalView}
                                        placeholder="Search by Asset"
                                        onChangeText={onChangeSearch}
                                        value={search}
                                    />
                                </View>
                                </View>
                                <FlatList style={{ marginTop: '10%' , flex:0, width:'100%'}}
                                    data={Data}
                                    keyExtractor={item => item.RegId}
                                    renderItem={({ item, index }) => {
                                        return <View  ><TouchableOpacity style={styles.touch}>
                                            <View style={styles.Flatlistview} >
                                                <View>
                                                    <Text style={styles.itemTitledate} >{item.AssetName}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.Flatlistview} >
                                                <View style={styles.col3}>
                                                    <Text style={styles.itemtittle} >Type</Text>
                                                </View>
                                                <Text style={styles.colon}>: </Text>
                                                <View style={styles.col7}>
                                                    <Text style={styles.assetname} >
                                                        {item.Type}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.Flatlistview} >
                                                <View style={styles.col3}>
                                                    <Text style={styles.itemtittle} >Agency Name</Text>
                                                </View>
                                                <Text style={styles.colon}>: </Text>
                                                <View style={styles.col7}>
                                                    <Text style={styles.assetname} >
                                                        {item.VendorName}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.Flatlistview} >
                                                <View style={styles.col3}>
                                                    <Text style={styles.itemtittle} >Premium</Text>
                                                </View>
                                                <Text style={styles.colon}>: </Text>
                                                <View style={styles.col7}>
                                                    <Text style={styles.assetname} >
                                                        {CommonFun.numberDigit(parseFloat(item.PremiumValue), 2)}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.Flatlistview} >
                                                <View style={styles.col3}>
                                                    <Text style={styles.itemtittle} >Due Date</Text>
                                                </View>
                                                <Text style={styles.colon}>: </Text>
                                                <View style={styles.col41}>
                                                    <Text style={styles.responsedby} > {item.TDate}</Text>
                                                </View>
                                                <View style={radd == 0 ? styles.hide : styles.col41}>
                                                    <TouchableOpacity onPress={() => editEntry(item)}>
                                                        <View style={styles.btnContainer}>
                                                            <Icon name="md-eye" type="ionicon" color="#fff" size={15} style={{ marginTop: 2 }} />
                                                            <Text style={styles.previewtxt}> Renew</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        </View>
                                    }}
                                />
                            <View>
                                <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                            </View>
                        </View>
                        {/* </ScrollView> */}
                    </View>
                </View>
            {/* </View> */}
        </>
    );
}
export default Amc;
const styles = StyleSheet.create({
    modalView: {
        backgroundColor: "white",
        borderRadius: 2,
        width: '96%',
        alignItems: "center",
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: '2%',
        marginBottom: 3,
        height: 40,
    },
    hide: {
        display: 'none'
    },
    row1: {
        marginTop: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        shadowColor: "#000",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        backgroundColor: '#fff',
        PaddingBottom: 5,
    },
    button: {
        backgroundColor: 'transparent',
        height: 50,
        fontSize: 18,
        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        margin: 5,
        paddingVertical: 2,
        paddingTop: 7,
        color: 'black',
    },
    searchview: {
        flex: 0,
 
    },
    touch: {
        borderRadius: 5,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        justifyContent: 'flex-start',
        borderLeftWidth: 3,
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
        elevation: 2,
    },
    flatlist: {
        fontSize: 20,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 250,
        height: '100%',
        overflow: 'scroll'
    },
    Flatlistview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 30,
    },
    Flatlistview1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginTop: 0,
    },
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',

    },
    previewtxt: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        paddingHorizontal: 3,
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,
        width: '60%',
        marginLeft: '10%'
    },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20,paddingBottom:25,
    },
    MainContainer: {
        flex: 0,
        alignItems: 'center',
        padding: 2,
        width: '100%',
        marginTop: 15,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemTitlehead: {
        color: '#ED0054',
        textAlign: 'center',
        fontSize: 12
    },
    itemTitledate: {
        color: '#0875d4',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',

    },
    assetname: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 13,
        paddingLeft: 5,
        paddingTop: 10,
    },
    type: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 13,
        paddingLeft: 6,
        paddingTop: 10,

    },
    responsedby: {
        flex: 0,
        color: '#ED0054',
        paddingRight: 3,
        paddingTop: 10,
        fontSize: 13,
    },
    col4: {
        width: '40%',
    },
    col3: {
        width: '30%',
    },
    col32: {
        width: '34%',
    },
    col31: {
        width: '29%',
        marginRight: 2,

    },
    col7: {
        width: '82%',
    },
    col60: {
        width: '70%',
    },
    col2: {
        width: '18%',
    },
    col20: {
        width: '13%',
    },
    col41: {
        width: '41%',
    },
    col15: {
        width: '15%',
    },
    colon: {
        paddingTop: 10,
        width: '1%',
    },
    itemtittle: {
        paddingTop: 10,
        color: '#5c6773',
        fontWeight: 'normal',
        fontSize: 13,
    },
    pickerView: {
        width: "98%",
    },
    pickerhead: {
        width: "98%",
        marginLeft: '1%',
        marginRight: '1%',
    },
    textStyle: {
        color: '#022969',
        marginTop: 20,
        textAlign: 'left',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    textInput: {
        height: 50,
        fontSize: 16,
        borderColor: COLORS.brdleftblue,
        borderWidth: 1,
        margin: 5,
        paddingVertical: 5,
        paddingTop: 15,
        color: 'black',
    },
    textStylecostcenter: {
        color: 'black',
        paddingTop: 8,
        paddingLeft: 10,
    },
    col66: {
        width: '66%',
    },
    col50: {
        width: '50%',
    },
})