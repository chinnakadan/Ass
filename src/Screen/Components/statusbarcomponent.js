import  React from 'react';
import { Platform ,StatusBar,View} from 'react-native';


const StatusBarComponent = () => {
 

    return (
        <View>
            {
                Platform.OS === 'ios' ?
                    <View>
                        <StatusBar backgroundColor="#0000" barStyle="light-content" />
                    </View> :   <View>
                        <StatusBar backgroundColor="#0000" barStyle="light-content" />
                    </View> 
            }
        </View>
    )
};

export default StatusBarComponent;