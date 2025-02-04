import { StyleSheet } from "react-native";
import colors from "../../../assets/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    viewLogo: {
        flex: 1,  
        justifyContent: 'center',
    },
   
    headerText: {
        position: 'absolute',
        bottom: 40,  
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    }
});

export default styles;
