import { useState, useEffect,useCallback } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Button, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import { ToastAndroid } from 'react-native';
import Moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import { COLORS, FONTCOLORS } from '../../theme/theme';
const MNotification = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [listItems, setlistItems] = useState([]);
    const [Data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [Preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value) => setShow(value), []);
    const [refDate, setRefDate] = useState(new Date());

    useEffect(() => {
        if (Data.length == 0) {
            let iMonth = refDate.getMonth() + 1
            let iYear = refDate.getFullYear();
            retrieveData(iMonth,iYear);
        }
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);


    function handleBackButtonClick() {
        props.navigation.navigate('MaintenanceDashboard');
        return true;
    }


    useEffect(() => {
    }, [refDate,Data]);


    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || refDate;
            showPicker(false);
            setRefDate(selectedDate);
            let iMonth = selectedDate.getMonth() + 1
            let iYear = selectedDate.getFullYear();
            // loadData(ccId, iMonth, iYear, entryType);
            setData([]);
            setlistItems([]);
            retrieveData(iMonth, iYear);
        },
    );


    const retrieveData = async (argMonth,argYear) => {
        try {
            setLoading(true);
            let iClientId = await AsyncStorage.getItem('clientId');
            let iUserId = await AsyncStorage.getItem('userId');
            setClientId(iClientId);
            setUserId(iUserId);
          
            let data = {
                ClientId: iClientId,
                UserId: iUserId,
                Month: argMonth,
                Year: argYear,
                type: 'getMSchedule'
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            setData(datas);
            setlistItems(datas);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }


    function showFollowup(item) {
        if (item.Type !=0) {
            props.navigation.push('AmcEntry', { RegisterId: item.RegId, RenewalType: item.Type });
        } else {
            props.navigation.push('PMFollowup', { RegisterId: item.RegId });
        }
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


    return (
        <>
            <Loader loading={loading} />
            <View style={[styles.row1, { width: '98%', marginLeft: '1%' }]}>
            <View style={{marginTop:10, width:'100%'}}>
                            <Text style={[{width:'98%'}, { color: FONTCOLORS.primary, textAlign: 'left', fontWeight: 'bold', paddingLeft: 5, }]}>Month</Text>

                    <View style={{width:'98%'}}>
                        <TouchableOpacity onPress={() => showPicker(true)} style = {{}}>
                            <Text style={[styles.textInput, { marginTop: show == false ? 20 : 170 }]} > {Moment(refDate).format('MMMM YYYY')}</Text>
                        </TouchableOpacity>
                        {show && (
                            <MonthPicker
                                onChange={onValueChange}
                                // changeDate
                                value={refDate}
                                // minimumDate={new Date()}
                                // maximumDate={new Date(2025, 5)}
                                locale="en"
                            />
                        )}
                    </View>
                    <View style={styles.col2}>
                    </View>

                </View>
            </View>
            {/* <ScrollView> */}
                <View style={styles.MainContainer}>
                    <View style={styles.centeredView}>
                        <View style={styles.searchview}>
                            <Searchbar style={styles.modalView}
                                placeholder="Search"
                                onChangeText={onChangeSearch}
                                value={search}
                            />
                            <FlatList style={styles.flatlist}
                                data={Data}
                                keyExtractor={item => item.RegId}
                                renderItem={({ item, index }) => {
                                    return <View  ><TouchableOpacity style={styles.touch}>
                                        <View style={styles.Flatlistview}>
                                            <View style={styles.col3}>
                                                <Text style={styles.itemtittle} >Asset Name</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col7}>
                                                <Text style={styles.assetname}>  {item.AssetName.slice(0, 15)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Flatlistview} >
                                            <View style={styles.col3}>
                                                <Text style={styles.itemtittle} >Type</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col7}>
                                                <Text style={styles.Type} > {item.TaskName.slice(0, 15)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.Flatlistview} >
                                            <View style={styles.col31}>
                                                <Text style={styles.itemtittle} >Due Date</Text>
                                            </View>
                                            <Text style={styles.colon}>: </Text>
                                            <View style={styles.col3nextdate}>
                                                <Text style={styles.duedate} >  {item.NextDate.slice(0, 15)}</Text>
                                            </View>
                                            <View style={styles.col3}>
                                                <TouchableOpacity onPress={() => showFollowup(item)}>
                                                    <View style={styles.btnContainer}>
                                                        <Icon name="md-eye" type="ionicon" color="#fff" size={15} style={styles.btnIcon} />
                                                        <Text style={styles.previewtxt}>Proceed</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    </View>
                                }}
                            />
                        </View>
                    </View>
                    <View>
                        <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                    </View>
                </View>
            {/* </ScrollView> */}
        </>
    );
}
export default MNotification;
const styles = StyleSheet.create({
    Flatlistview2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',

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
    modalView: {
        backgroundColor: "white",
        borderRadius: 2,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: '5%',
        marginBottom: 3,
        height: 40,
    },

    searchview: {
        flex: 0,
        marginTop: 22,
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
        padding: 20,
        fontWeight: 'bold',
        color: 'blue',
    },
    itemTitle1: {
        flex: 0,
        color: 'black',
        fontWeight: 'bold',
        paddingLeft: 5,
        textAlign: 'left',
        paddingTop: 11,

    },

    nextdate:
    {
        color: 'black',
        textAlign: 'left',
        paddingTop: 11,
        paddingRight: 10,
    },

    itemTitle3: {
        color: 'red',
        paddingBottom: 10,
        fontWeight: 'bold',
        fontSize: 16
    },
    Flatlistview:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 35,
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
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    MainContainer: {
        flex: 0,
        alignItems: 'center',
        padding: 2,
        width: '100%',
        // marginTop:30,
    },
    btnIcon: {
        marginTop: 4, height: 20, width: 20,
    },
    previewmodaltext:
        { color: 'black', height: 30, fontWeight: 'bold', fontSize: 18, },
    filteEmpty: {
        color: 'red',
        textAlign: 'center',
        padding: 10,
        fontSize: 20
    },
    assetname:
    {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 10,
    },
    Type:
    {
        color: '#ED0054',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 6,
        paddingTop: 10,
    },
    duedate: {
        flex: 0,
        color: '#088548',
        paddingRight: 3,
        paddingTop: 10,

    },
    col3: {
        width: '29%',
    },
    col31: {
        width: '28%',
    },
    col7: {
        width: '82%',
    },
    col2: {
        width: '18%',
    },
    col3nextdate:
    {
        width: '30%',
        marginRight: 25,
    },
    colw25: {
        width: '20%',

    },
    col45: {
        width: '45%',

    },
    colon:
    {
        paddingTop: 10,
        width: '1%',
    },
    itemtittle:
    {
        paddingTop: 10,
        color: '#5c6773',

    },
    Flatlistview1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 40,
        marginTop: 0,
        marginBottom: 10,
    },
    textStyle: {
        color: FONTCOLORS.primary,
        marginTop: 20,
        textAlign: 'right',
        fontWeight: 'bold',
        marginLeft: 5,
    },
})