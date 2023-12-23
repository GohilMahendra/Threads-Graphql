import { View, Text, SafeAreaView, Vibration, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStacktype } from '../../navigations/ProfileStack'
import { FlatList } from 'react-native'
import { Thread } from '../../types/Post'
import ProfilePost from '../../components/profile/PofilePost'
import { DeletePostAction, FetchMoreUserPostsAction, FetchUserPostsAction } from '../../redux/slices/UserSlice'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import UseTheme from '../../globals/UseTheme'
import { User } from '../../types/User'
import { SearchStackParams } from '../../navigations/SearchStack'
import { fetchUserById } from '../../apis/UserAPI'
import { fetchPostsByUser } from '../../apis/FeedAPI'
import RepostItem from '../../components/feed/RepostItem'
import PostItem from '../../components/feed/PostItem'
import { twitter_blue } from '../../globals/Colors'

const UserProfile = () => {

    const [user, setUser] = useState<User>({
        _id: "",
        email: "",
        followers: 0,
        following: 0,
        fullname: "",
        username: "",
        verified: false,
        bio: "",
        profile_picture: "",
        isFollowed: false
    })
    const route = useRoute<RouteProp<SearchStackParams, "UserProfile">>()
    const [userId,setUserId] = useState(route.params.userId)
    const [posts, setPosts] = useState<Thread[]>([])
    const [lastOffset, setLastOffset] = useState<string | null>(null)
    const navigation = useNavigation<NavigationProp<ProfileStacktype, "Profile">>()
    const [selectedSection, setSelectedSection] = useState("Threads")
    const threeDotPressModalRef = useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['30%'], []);
    const [postId, setPostId] = useState("")
    const { theme } = UseTheme()
    const handleThreedotPress = useCallback((postId: string) => {
        setPostId(postId)
        threeDotPressModalRef.current?.present()
    }, [])
    
    const navigateToProfile = (userId:string) =>
    {
        setUserId(userId)
    }

    const renderPosts = (item: Thread, index: number) => {
        return (
            item.isRepost && item.Repost ?
                <RepostItem
                    onPressComment={() => console.log("")}
                    onRepost={() => console.log("")}
                    key={item._id}
                    post={item}
                />
                :
                <PostItem
                    onPressNavigate={(userId)=>navigateToProfile(userId)}
                    onPressComment={() => console.log("")}
                    onRepost={() => console.log("")}
                    key={item._id}
                    post={item}
                />
        )
    }
    const getPosts = async () => {
        try {
            const response = await fetchPostsByUser(userId)
            setPosts(response.data)
            setLastOffset(response.lastOffset)
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
    }
    const getUser = async () => {
        try {
            const response = await fetchUserById(userId)
            setUser(response.user)
        }
        catch (err) {
            console.log(err)
        }
    }
    const renderBioWithPressableHashtags = (bioText:string) => {
        const paragraphs = bioText.split('\n');

    return paragraphs.map((paragraph, paragraphIndex) => (
      <View key={paragraphIndex} style={{ flexDirection: 'row' }}>
        {paragraph.split(/\s+/).map((word, wordIndex) => {
          if (word.startsWith('#')) {
            return (
              <TouchableOpacity key={wordIndex} >
                <Text style={{ color: 'blue', fontWeight: 'bold' }}>{word} </Text>
              </TouchableOpacity>
            );
          } else {
            return <Text key={wordIndex}>{word} </Text>;
          }
        })}
      </View>
    ));
      };
    const loadMorePosts = async () => {

    }

    useEffect(() => {
        getUser()
        getPosts()
    }, [userId])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: theme.background_color
            }}>
                <ScrollView style={{
                    flex: 1,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        padding: 20
                    }}>
                        <FontAwesome5Icon
                            onPress={() => navigation.goBack()}
                            name='angle-left'
                            size={20}
                            color={theme.text_color}
                        />
                    </View>
                    <View style={{
                        padding: 20,
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <View>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: theme.text_color
                                }}>{user.fullname}</Text>
                                <Text style={{
                                    color: theme.text_color
                                }}>{user.username}</Text>
                            </View>
                            <Image
                                source={user.profile_picture ? { uri: user.profile_picture } : placeholder_image}
                                style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 70
                                }}
                            />
                        </View>
                        <Text 
                        style={{ color: twitter_blue,flexWrap:"wrap"}}>{renderBioWithPressableHashtags(user.bio || "")}</Text>
                        <Text style={{ color: theme.text_color, marginTop:10 }}>{user.followers} Followers</Text>
                        <TouchableOpacity style={{
                            marginTop:20,
                            width:'100%',
                            backgroundColor: theme.text_color,
                            padding:10,
                            borderRadius:10,
                            justifyContent:"center",
                            alignItems:"center"
                        }}>
                            <Text style={{
                                color: theme.background_color,
                                fontSize:15,
                                fontWeight:'bold'
                            }}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        //xmarginTop: 20,
                        flexDirection: "row",
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity
                            onPress={() => setSelectedSection("Threads")}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottomWidth: (selectedSection == "Threads") ? 1 : 0,
                                borderColor: theme.text_color
                            }}
                        >
                            <Text style={{
                                fontSize: 15,
                                color: theme.text_color
                            }}>Threads</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedSection("Reposts")}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottomWidth: (selectedSection == "Reposts") ? 1 : 0,
                                borderColor: theme.text_color
                            }}
                        >
                            <Text style={{
                                fontSize: 15,
                                color: theme.text_color
                            }}>Reposts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSelectedSection("Replies")}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottomWidth: (selectedSection == "Replies") ? 1 : 0,
                                borderColor: theme.text_color
                            }}
                        >
                            <Text style={{
                                fontSize: 15,
                                color: theme.text_color
                            }}>Replies</Text>
                        </TouchableOpacity>
                    </View>
                    {selectedSection == "Threads" && <FlatList
                        style={{
                           /// padding: 10,
                          // backgroundColor:"green"
                        }}
                        data={posts}
                        renderItem={({ item, index }) => renderPosts(item, index)}
                        onEndReached={() => loadMorePosts()}
                    />
                    }
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}
export default UserProfile