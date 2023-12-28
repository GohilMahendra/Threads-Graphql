import React from "react";
import { Text, View, Modal, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import UseTheme from "../../globals/UseTheme";
const Loader = () => {
    const { theme } = UseTheme()
    return (
        <View style={styles.container}>
            <Modal
                style={{ flex: 1 }}
                transparent

            >
                <View style={styles.loaderContainer}>
                    <ActivityIndicator
                        animating
                        size={"large"}
                        color={theme.text_color}
                    />
                </View>
            </Modal>
        </View>
    )
}
export default Loader
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        position: "absolute"
    },
    loaderContainer:
    {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
})