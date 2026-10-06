import { StyleSheet } from "react-native";

const staticStyles = StyleSheet.create({
    centered: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    // Start Screen
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    headerText: {
        fontSize: 26,
        fontWeight: '600',
        color: '#554A6B',
        marginBottom: 30,
        marginLeft: 10,
    },
    form: {
        backgroundColor: '#E7DDF7',
        borderRadius: 8,
        padding: 20,
        height: 480,
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
        color: '#333333',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    halfButton: {
        backgroundColor: '#6A569E',
        borderRadius: 6,
        paddingVertical: 12,
        flex: 0.48,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3D3059',
    },
    fullButton: {
        backgroundColor: '#6A569E',
        borderRadius: 6,
        paddingVertical: 12,
        alignItems: 'center'
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: '400',
    },
    // Start screen ends
});

export default staticStyles;