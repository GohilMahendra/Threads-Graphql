import {
    View, Text, Image, TextInput,
    SafeAreaView, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet
} from 'react-native'
import React, { useState } from 'react'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import UseTheme from '../../globals/UseTheme';
import Loader from '../../components/global/Loader';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackType } from '../../navigations/RootStack';
import { UploadMedia } from '../../types/Post';
import PostViewItem from '../../components/profile/PostViewItem';
import { createRepostAction } from '../../redux/slices/UserSlice'

const QoutePost = () => {

    const route = useRoute<RouteProp<RootStackType, "QoutePost">>()
    const { Thread } = route.params
    const postId = Thread._id
    const navigation = useNavigation<NavigationProp<RootStackType, "CreatePost">>()
    const [content, setContent] = useState<string>("")
    const user = useSelector((state: RootState) => state.User.user)
    const loading = useSelector((state: RootState) => state.User.loading)
    const { theme } = UseTheme()
    const dispatch = useAppDispatch()
    const createPost = async () => {
        const fullfilled = await dispatch(createRepostAction({
            postId: postId,
            content: content
        }))
    }
    return (
        <SafeAreaView style={[styles.container, {
            backgroundColor: theme.secondary_background_color
        }]}>
            {loading && <Loader />}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.avoidingView}>
                {/* header starts*/}
                <View style={styles.headerContainer}>
                    <FontAwesome5Icon
                        onPress={() => navigation.goBack()}
                        name='angle-left'
                        size={20}
                        color={theme.text_color}
                    />
                    <Text style={[styles.headerText, { color: theme.text_color }]}>Qoute Post</Text>
                    <TouchableOpacity
                        onPress={() => createPost()}
                        style={[styles.btnPost, {
                            backgroundColor: theme.primary_color,
                        }]}>
                        <Text style={styles.txtPost}>Post</Text>
                    </TouchableOpacity>
                </View>
                {/* header ends */}
                <ScrollView>
                    <View style={styles.userInfoContainer}>
                        <Image
                            resizeMode='cover'
                            source={user.profile_picture ? { uri: user.profile_picture } : placeholder_image}
                            style={styles.imageUser}
                        />
                        <View style={{
                            width: "80%"
                        }}>
                            <View style={[styles.inputContainer]}>
                                <TextInput
                                    value={content}
                                    onChangeText={(text: string) => setContent(text)}
                                    placeholder={"Type the qoute here ..."}
                                    placeholderTextColor={theme.placeholder_color}
                                    multiline={true}
                                    //numberOfLines={5}
                                    style={[styles.inputQoute, { color: theme.text_color }]}
                                />
                                <AntDesign
                                    //  style={{flex:0.2}}
                                    onPress={() => setContent("")}
                                    name='close'
                                    size={15}
                                    color={theme.text_color}
                                />
                            </View>
                        </View>
                    </View>
                    <PostViewItem
                        post={Thread}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default QoutePost
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
    },
    avoidingView:
    {
        flex: 1,
        padding: 10
    },
    headerContainer:
    {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerText:
    {
        fontSize: 15,
        textAlign: 'center'
    },
    btnPost:
    {
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
    },
    txtPost:
    {
        color: "white",
        fontWeight: "bold"
    },
    userInfoContainer:
    {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'flex-start'
    },
    imageUser:
    {
        height: 40,
        width: 40,
        borderRadius: 40,
        marginRight: 10
    },
    inputContainer:
    {
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // backgroundColor: theme.secondary_background_color,
        // height: 150,
    },
    inputQoute:
    {
        textAlignVertical: "top",
        maxHeight: 200,
        flex: 1,
        marginRight: 20
    }
})