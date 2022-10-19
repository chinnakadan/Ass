
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
const GetGeoLocation = {
    GetLocation: async () => {
        let arrObj = [];
        Geocoder.init('AIzaSyDaNPyxJ7NKmZ4rC8awB-BlBh6ieH1Q9os');
        Geolocation.getCurrentPosition(position =>
            Geocoder.from(position.coords.latitude, position.coords.longitude).then(json => {
                let sLocation = json.results[0].formatted_address;
                let dlatitude = position.coords.latitude;
                let dlongitude = position.coords.longitude;
                arrObj = { 'location': sLocation, 'latitude': dlatitude, 'longitude': dlongitude };
            })
        )
        return arrObj;   
    }
}
export default GetGeoLocation;