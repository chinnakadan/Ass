
import React, { useState, useRef, useEffect } from "react";
import { View, Image, ScrollView, TouchableOpacity ,Button,Text,StyleSheet} from "react-native";
import ViewShot from "react-native-view-shot";
var RNFS = require("react-native-fs");
import Share from "react-native-share";

const ShareScreen = () => {
  const viewShotRef = useRef(null);
  const [isSharingView, setSharingView] = useState(false);
  const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     if (isSharingView) {

//      shareScreenshot();
//    }
//  }, [isSharingView]);

const captureAndShareScreenshot = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const res = await RNFS.readFile(uri, "base64");
      const urlString = `data:image/jpeg;base64,${res}`;
      console.log('chinna', res)
      const info = '...';
      const filename = '...';
      const options = {
        title: info,
        message: info,
        url: urlString,
        type: "image/jpeg",
        filename: filename,
        subject: info,
      };
      await Share.open(options);
      setSharingView(false);
    } catch (error) {
      setSharingView(false);
      console.log("shareScreenshot error:", error);
    }
    setLoading(false);
  };
 return (
  <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
      <Loader loading={loading} />

<View  ><TouchableOpacity style={styles.touch}>
<View style={styles.Flatlistview} >
                                                        <View style={styles.col60}>
                                                            <Text style={styles.itemTitledate} >AQWAGGVV</Text>
                                                        </View>
                                                        <View style={styles.col4}>
                                                            <Text style={styles.itemTitlehead} >10-01-2022</Text>
                                                        </View>
                                                    </View>
<View style={styles.Flatlistview} >
                                                        <View style={styles.col3}>
                                                            <Text style={styles.itemtittle} >CostCentre Name</Text>
                                                        </View>
                                                        <Text style={styles.colon}>: </Text>
                                                        <View style={styles.col7}>
                                                            <Text style={styles.assetname} >
                                                                AK Project</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.Flatlistview} >
                                                        <View style={styles.col3}>
                                                            <Text style={styles.itemtittle} >Type</Text>
                                                        </View>
                                                        <Text style={styles.colon}>: </Text>
                                                        <View style={styles.col7}>
                                                            <Text style={styles.assetname} >
                                                               Idle
                                                                </Text>
                                                        </View>
                                                    </View>
                                                  
                                                    </TouchableOpacity>
                                                    </View>
    <View style={{backgroundColor:'blue'}}>
    <Text>chinna</Text>
               <Button
                    title="Capture and Share"
                    onPress={captureAndShareScreenshot}
                />

      {/* <ScrollView /> */}
    </View>
  </ViewShot>
  )
}

export default ShareScreen;
const styles = StyleSheet.create({

    touch: {
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
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
   
    btnContainer: {
        flexDirection: 'row',
        backgroundColor: '#040485',
        paddingHorizontal: 4,
        paddingVertical: 5,
        borderRadius: 5,
        width: '70%',
        marginLeft: '15%'
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
        fontSize: 15,
        fontWeight: 'bold',
    },
    assetname: {
        color: '#003885',
        textAlign: 'left',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 10,
    },

    col4: {
        width: '40%',
    },
    col3: {
        width: '30%',
    },
 
    col7: {
        width: '82%',
    },
    col60: {
        width: '70%',
    },

    colon: {
        paddingTop: 10,
        width: '1%',
    },
    itemtittle: {
        paddingTop: 10,
        color: '#5c6773',
        fontWeight: 'normal',
    },

})