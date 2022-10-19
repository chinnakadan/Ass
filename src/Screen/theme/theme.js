import { Dimensions } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
const { width, height } = Dimensions.get("window");

export const COLORS = {
    // base colors
    primary: "#040485", // blue
    secondary: "#195e49",   // dark green
    brdleftblue: "#03509c",
    touchprimary:"#cad4e8",
    inputborder:"'#a7b7d9",

    green:"green",
    // pink:"#bf152b",
    // orange: "#d15f02",
    // red: "#c4190e",
    // blue1:'#085dc4',
    // blue2:' #0b94ba',
    // blue3:'#07b3b0',
    // purple: "#5009ad",

 

    lightpurple: "#F3EFFF",
    yellow: "#FFC664",
    lightyellow: "#FFF9EC",
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#FCFBFC",
    gray: "#C1C3C5",
    darkgray: "#C3C6C7",
    transparent: "transparent",
};

export const FONTCOLORS = {
    //// primary color 
     primary:"#022969",
      //primary:"#195e49",
  ///
      black:'black',
      darkgrey: '#87888c', 
      darkblue:"#022969",
      lightwhite: "#fcfcfc",
      blue:"#003885",
      fontcolor1:"#0a3d8f",
  };
export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 30,
    padding: 10,
    padding2: 12,
    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,
    body5: 12,
    // app dimensions
    width,
    height
};

export const FONTS = {
    largeTitle: { fontFamily: "Roboto-regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
    body5: { fontFamily: "Roboto-Regular", fontSize: SIZES.body5, lineHeight: 22 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;