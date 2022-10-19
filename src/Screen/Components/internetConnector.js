import React from 'react';
import { View, Text } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
const InternetBar = () => {
    const netInfo = useNetInfo();

    return (
        <View>
            {
                !netInfo.isConnected ?
                    <View style={{ width: '100%', backgroundColor: 'red', height: 30, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>Not connected to Internet</Text>
                    </View> : null
            }
        </View>
    );
};

export default InternetBar;