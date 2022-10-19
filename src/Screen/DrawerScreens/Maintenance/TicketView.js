import { useState, useEffect } from 'react';
import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Button, BackHandler, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';;
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-elements/dist/icons/Icon';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { ToastAndroid } from 'react-native';
import { Maintentance } from '../../../service/api/apiservice';
import Loader from '../../Components/Loader';
import ActionButton from 'react-native-action-button';
import { COLORS } from '../../theme/theme';
//import Icon from 'react-native-vector-icons/Ionicons';
const TicketView = (props) => {
    const [ClientId, setClientId] = useState('0');
    const [UserId, setUserId] = useState('0');
    const [customSelectedIndex, setCustomSelectedIndex] = useState(0);
    const [listItems, setlistItems] = useState([]);
    const [Data, setData] = useState([]);
    const [listItemsP, setlistItemsP] = useState([]);
    const [DataP, setDataP] = useState([]);
    const [search, setSearch] = useState('');
    const [searchP, setSearchP] = useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [Preview, setPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [Count, setCount] = useState('');
    const [rtadd, setrtAdd] = useState(0);
    const [rfadd, setrfAdd] = useState(0);
    useEffect(() => {
        if (Data.length == 0) retrieveData();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [ClientId, UserId]);
    function handleBackButtonClick() {
        props.navigation.navigate('MaintenanceDashboard');
        return true;
    }
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
                type: "getTicket",
            };
            const response = await Maintentance(data)
            const datas = await response.json();
            setlistItems(datas.open);
            setData(datas.open);
            setlistItemsP(datas.progress);
            setDataP(datas.progress);
            setrtAdd(datas.tadd);
            setrfAdd(datas.fadd);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
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
    const onChangeSearchP = (query) => {
        try {
            if (query) {
                const newData = listItemsP.filter(
                    function (item) {
                        const itemData = item.AssetName
                            ? item.AssetName.toUpperCase()
                            : ''.toUpperCase();
                        const textData = query.toUpperCase();
                        return itemData.indexOf(textData) > -1;
                    }
                );
                setDataP(newData);
                setSearchP(query);
            } else {
                setDataP(listItemsP);
                setSearchP(query);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const updateCustomSegment = (event) => {
        setCustomSelectedIndex(event);
    };
    function showFollowup(item) {
        props.navigation.push('MFollowup', { ShTransId: 0, TicketId: item.TicketId });
    }
    return (
        <>
            <Loader loading={loading} />
            <View style={styles.container}>
                <View style={styles.centeredView}>
                    <View style={styles.MainContainer}>
                        <SegmentedControlTab
                            borderRadius={0}
                            values={['Fresh Ticket', 'In-Progress']}
                            selectedIndex={customSelectedIndex}
                            onTabPress={updateCustomSegment}
                            tabsContainerStyle={{
                                height: 45,
                                backgroundColor: '#bfd0e3'
                            }}
                            tabStyle={{
                                backgroundColor: '#bfd0e3',
                                borderWidth: 0,
                                borderColor: 'transparent',
                            }}
                            activeTabStyle={{ backgroundColor: COLORS.primary, marginTop: 2 }}
                            tabTextStyle={{ color:  COLORS.primary, fontWeight: 'bold', fontSize: 16 }}
                            activeTabTextStyle={{ color: '#fff', fontSize: 16 }}
                        />
                        {customSelectedIndex === 0 && (
                          
                                <View style={styles.MainContainer2}>
                                    <View style={styles.centeredView}>
                                    <View style={styles.searchview}>
                                        <Searchbar style={styles.modalView}
                                            placeholder="Search"
                                            onChangeText={onChangeSearch}
                                            value={search}
                                        />
                                    </View>
                                          <FlatList style={{  marginBottom: 250 }}
                                                data={Data}
                                                keyExtractor={item => item.TicketId}
                                                renderItem={({ item, index }) => {
                                                    return <View  ><TouchableOpacity style={styles.touch}>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col6}>
                                                                <Text style={styles.itemTitledate} >{item.TicketNo}</Text>
                                                            </View>
                                                            <View style={styles.col4}>
                                                                <Text style={styles.itemTitlehead} >{item.TicketDate}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Asset Name</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.assetname} >
                                                                    {item.AssetName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Ticket Type</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.type} >
                                                                    {item.TicketType}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >CostCentre</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.type} >
                                                                    {item.CostCentreName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Priority</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.type} >
                                                                    {item.Priority}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Raised by</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col41}>
                                                                <Text style={styles.responsedby} > {item.UserName}</Text>
                                                            </View>
                                                            <View style={rfadd==0 ? styles.hide : styles.col3}>
                                                                <TouchableOpacity onPress={() => showFollowup(item)}>
                                                                    <View style={styles.btnContainer}>
                                                                        <Text style={styles.previewtxt}>Followup</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                        {/* <View style={styles.Flatlistview} >
                                                            <Text style={styles.itemTitle1} > <Text style={styles.itemtittle} >Raised by:</Text> </Text>
                                                            <View style={styles.btnContainer}>
                                                                <Icon name="md-eye" type="ionicon" color="#fff" size={15} style={styles.btnIcon} />
                                                                <Text onPress={() => showFollowup(item)} style={styles.previewtxt}>Followup</Text>
                                                            </View>
                                                        </View> */}
                                                    </TouchableOpacity>
                                                    </View>
                                                }}
                                            />
                                    
                                    </View>
                                    <View>
                                        <Text style={styles.filteEmpty}>{Data.length == 0 ? 'No Data Found' : null}</Text>
                                    </View>
                                </View>
                           
                        )}
                        {customSelectedIndex === 1 && (
                            // <ScrollView>
                                <View style={styles.MainContainer2}>
                                    <View style={styles.centeredView}>
                                        <View style={styles.searchview}>
                                            <Searchbar style={styles.modalView}
                                                placeholder="Search"
                                                onChangeText={onChangeSearchP}
                                                value={searchP}
                                            />
                                                 </View>
                                          <FlatList style={{  marginBottom: 250 }}
                                                data={DataP}
                                                keyExtractor={item => item.TicketId}
                                                renderItem={({ item, index }) => {
                                                    return <View><TouchableOpacity style={styles.touch}>

                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col6}>
                                                                <Text style={styles.itemTitledate} >{item.TicketNo}</Text>
                                                            </View>
                                                            <View style={styles.col4}>
                                                                <Text style={styles.itemTitlehead} >{item.TicketDate}</Text>
                                                            </View>

                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Asset Name</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.assetname} >
                                                                    {item.AssetName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview}>
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Ticket Type</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.type}>{item.TicketType}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >CostCentre</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.costcenter} > {item.CostCentreName}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Priority:</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.priority} >  {item.Priority}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Expected Date</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col7}>
                                                                <Text style={styles.expecteddate} >  {item.TargetDate}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.Flatlistview} >
                                                            <View style={styles.col3}>
                                                                <Text style={styles.itemtittle} >Responded by</Text>
                                                            </View>
                                                            <Text style={styles.colon}>: </Text>
                                                            <View style={styles.col41}>
                                                                <Text style={styles.responsedby} >{item.UserName}</Text>
                                                            </View>
                                                            <View style={rfadd==0 ? styles.hide : styles.col41}>
                                                                <View style={styles.btnContainer}>
                                                                    {/* <Icon name="md-eye" type="ionicon" color="#fff" size={15} style={styles.btnIcon} /> */}
                                                                    <Text onPress={() => showFollowup(item)} style={styles.previewtxt}>Followup</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    </View>
                                                }}
                                            />
                                   
                                    </View>
                                    <View>
                                        <Text style={styles.filteEmpty}>{DataP.length == 0 ? 'No Data Found' : null}</Text>
                                    </View>
                                </View>
                            // </ScrollView>
                        )}
                    </View>
            
                </View>
                <TouchableOpacity
                        style={rtadd==0 ? styles.hide : {
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            position: 'absolute',
                            bottom: 50,
                            right: 10,
                            height: 50,
                            backgroundColor: COLORS.primary,
                            borderRadius: 100,
                        }}
                        onPress={() => {props.navigation.navigate('MaintenanceTicket')}}
                    >
                        <Icon name='add' size={35} color='#ffff' />
                    </TouchableOpacity>
            </View>
        </>
    );
}
export default TicketView;
const styles = StyleSheet.create({

    MainContainer2: {
        flex: 0,
        alignItems: 'center',
        padding: 2,
        width: '100%',
  
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 3,
        width: '90%',
        alignItems: "center",
        shadowColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: '5%',
        marginBottom: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: 'transparent',
    },
    searchview: {
        flex: 0,
        marginTop: 22,
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
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 20,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: 28,
    },
    previewtxt:
    {
        color: '#fff',
        textAlign: 'center',
        fontSize: 13,
        paddingHorizontal: 5,
    },
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginHorizontal: 5,
        paddingHorizontal: 1,
        paddingVertical: 5,
        borderRadius: 5,
        width:'70%'
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

    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    MainContainer: {
        flex: 0,
        alignItems: 'center',
        padding: 8,
        width: '100%'
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        // padding: 10,
    },
    container3: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    itemTitlehead:
    {
        color: '#ED0054',
        textAlign: 'center',
        fontSize: 11
    },
    itemTitledate:
    {
        color: '#0875d4',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',

    },
    assetname:
    {
        // color: '#003885',
        color: '#003885',
        textAlign: 'left',
        fontSize: 14,
        paddingLeft: 5,
        paddingTop: 10,
    },
    type:
    {
        // color: '#ED0054',
        color: '#003885',
        textAlign: 'left',
        fontSize: 14,
        paddingLeft: 6,
        paddingTop: 10,

    },
    costcenter: {
        flex: 0,
        // color: '#088548',
        color: '#003885',
        paddingRight: 3,
        paddingTop: 10,

    },
    priority: {
        flex: 0,
        // color: '#D64135',
        color: '#003885',
        paddingRight: 3,
        paddingTop: 10,

    },
    raisedby: {
        flex: 0,
        // color: '#088548',
        color: '#003885',
        paddingRight: 3,
        paddingTop: 10,
    },
    expecteddate: {
        flex: 0,
        // color: '#a87b00',
        color: '#088548',
        paddingRight: 3,
        paddingTop: 10,
    },
    responsedby: {
        flex: 0,
        //color: '#088548',
        color: '#ED0054',
        paddingRight: 3,
        paddingTop: 10,
    },
    col4: {
        width: '40%',
    },
    col3: {
        width: '30%',
    },
    col31: {
        width: '29%',

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
        marginRight: 15,
    },
    col4: {
        width: '40%',
    },
    col41: {
        width: '41%',
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
         fontSize: 13,
        fontWeight: 'normal',
    },
    marbtm20:
    {
        marginBottom: 10,
    }
})