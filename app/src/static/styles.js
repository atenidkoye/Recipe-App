import { StyleSheet } from "react-native";

const staticStyles = StyleSheet.create({
    centered: {
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    iconButton: {
        borderRadius: 7,
        padding: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    iconButtonImage: {
        width: 25,
        height: 25,
    },

    confirmButton: {
        backgroundColor: "#6A569E",
    },

    cancelButton: {
        backgroundColor: "#D63A3A",
    },

    // login/register screen
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    headerText: {
        fontSize: 26,
        fontWeight: '600',
        color: '#554A6B',
        marginBottom: 15,
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
        fontSize: 18,
        fontWeight: '400',
        textAlign: "center"
    },
    // login/register screen ends

    // recipe list screen
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#E7DDF7',
        marginHorizontal: 10,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 5,
        alignItems: 'center',
        marginBottom: 10,
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
        marginBottom: 50,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    recipeBackground: {
        position: "absolute", 
        left: 0, 
        top: 0, 
        height: "90%", 
        width: "100%", 
        borderRadius: 10,
        alignItems: "center"
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
    listAddButton: {
        position: "absolute",
        bottom: 100,
        right: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#6A569E",
    },  
    // recipe list screen ends
    // shopping list screen
    shoppingContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    listsContainer: {
        flex: 1
    },
    listItem: {
        width: '100%',
        padding: 15,
        backgroundColor: '#E7DDF7',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'white'
    },
    listForm: {
        backgroundColor: '#E7DDF7',
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 50,
        borderRadius: 10,
        maxHeight: 350,
    },
    shopScroll: {
        maxHeight: 180,
        marginBottom: 10,
    },
    shopInput: {
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        height: 45,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    addMore: {
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 5,
    },
    addMoreText: {
        fontWeight: '600',
        color: '#6A569E',
    },
    addButton: {
        alignItems: 'center',
        backgroundColor: '#6A569E',
        height: 45,
        borderRadius: 5,
        marginTop: 5,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 12,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    itemTextChecked: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    // shopping list screen ends

    // recipe editor screen starts
    editorButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },

    editorButton: {
        width: "40%",
        borderRadius: 10,
        paddingVertical: 10
    },

    editorForm: {
        borderColor: "#E0E0E0",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#E7DDF7",
        paddingHorizontal: 10,
        marginBottom: 20,
    },

    editorFormPart: {
        borderColor: "#6A569E",
        borderBottomWidth: 2,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },

    editorPublicButton: {
        padding: 10,
        backgroundColor: "#6A569E",
        borderRadius: 10
    },

    editorMainLabel: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold"
    },

    editorInput: {
        backgroundColor: 'white',
        borderRadius: 6,
        borderBottomWidth: 2,
        borderColor: '#6A569E',
        paddingHorizontal: 7,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
    },

    editorBigInput: {
        textAlignVertical: "top",
        minHeight: 150,
    },

    editorNumericInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15
    },

    editorLabelAndInput: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    editorServings: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: 10, 
    },

    editorMultiRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        gap: 10
    },

    editorIconButton: {
        marginBottom: 5, 
        borderBottomWidth: 2,
        borderColor: "#6A569E",
    },

    editorCategory: {
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 7,
        borderRadius: 10,
        backgroundColor: "#6A569E80",
        color: "white",
        fontWeight: "bold"
    },
    // recipe editor screen ends

    // modal style starts
    modal: {
        flex: 1,
        backgroundColor : "#000000C8",
        alignItems: 'center',
        justifyContent: 'center',
    },  
    
    modalView: {
        height: 300,
        width: "100%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "#F4EAFB",
        borderWidth: 1,
        borderTopWidth: 2,
        borderBottomWidth: 0,
        borderColor: "#6A569E",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },

    modalSlot: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: 20,
        height: 190
    },

    modalTimeContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },

    modalTimeInput: {
        fontSize: 24, 
        padding: 20,
        paddingHorizontal: 30,
        backgroundColor: "white",
        borderRadius: 10,
    },


    // modal style ends
});

export default staticStyles;