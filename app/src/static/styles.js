import { StyleSheet } from "react-native";

const staticStyles = StyleSheet.create({
    centered: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    // login/register screen
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
        marginBottom: 8,
    },
    label2: {
        fontSize: 16,
        marginTop: 5,
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
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
    },
    rowButtons2: {
        flexDirection: 'row',
        justifyContent: 'center',
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
    // login/register screen ends

    // recipe list screen
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#E7DDF7',
        marginHorizontal: 10,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 25,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    searchIcon: {
        resizeMode: 'contain',
        marginLeft: 10,
    },
    mainContent: {
        flex: 1,
        paddingTop: 10,
    },
    listContainer: {
        flex: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    recipeCard: {
        flexDirection: 'row',
        backgroundColor: '#E7DDF7',
        borderRadius: 12,
        padding: 30,
        marginBottom: 15,
        alignItems: 'center',
    },
    recipeTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    category: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    description: {
        fontSize: 12
    },
    // recipe list screen ends
});

export default staticStyles;