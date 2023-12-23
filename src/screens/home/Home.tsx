import { View, FlatList, Button, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { CompositeNavigationProp, NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackType } from '../../navigations/RootStack'
import { UserTabType } from '../../navigations/UserTab'
import { BASE_URL } from '../../globals/constants'
import { Thread } from '../../types/Post'
import PostItem from '../../components/feed/PostItem'
import { fetchPosts } from '../../apis/FeedAPI'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { FetchMorePostsAction, FetchPostsAction, createRepostAction } from '../../redux/slices/FeedSlice'
import Replies from '../../components/feed/Replies'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from 'react-native-elements'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import RepostItem from '../../components/feed/RepostItem'
import { RefreshControl } from 'react-native'
import UseTheme from '../../globals/UseTheme'
import { HomeStackParams } from '../../navigations/FeedStack'
const Home = () => {

  const navigation = useNavigation<NavigationProp<HomeStackParams,"Home">>()
  const {theme} = UseTheme()
  const posts = useSelector((state: RootState) => state.Feed.Threads)
  const loading = useSelector((state: RootState) => state.Feed.loading)
  const dispatch = useAppDispatch()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const repostSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['90%', '20%'], []);
  const [postId, setPostId] = useState("")
  const snapPointsRepost = useMemo(() => ["30%"], [])

  const handleRepostModal = useCallback((postId: string) => {
    setPostId(String)
    repostSheetModalRef.current?.present()
  }, [])
  const handlePresentModalPress = useCallback((postId: string) => {
    setPostId(postId)
    bottomSheetModalRef.current?.present();
  }, []);

  const onPressRepost = async () => {
    repostSheetModalRef.current?.close()
    await dispatch(createRepostAction({ postId }))
  }

  const navigateToProfile = (userId:string) =>
  {
    navigation.navigate("UserProfile",{
      userId: userId
    })
  }

  const renderPosts = (item: Thread, index: number) => {
    return (

      item.isRepost && item.Repost ?
        <RepostItem
          onPressComment={handlePresentModalPress}
          onRepost={handleRepostModal}
          key={item._id}
          post={item}
        />
        :
        <PostItem
          onPressNavigate={(userId)=>navigateToProfile(userId)}
          onPressComment={handlePresentModalPress}
          onRepost={handleRepostModal}
          key={item._id}
          post={item}
        />

    )
  }
  const fetcchMorePosts = async () => {
    await dispatch(FetchMorePostsAction(""))
  }
  useEffect(() => {
    dispatch(FetchPostsAction(""))
  }, [])
  return (
    <GestureHandlerRootView style={{
      flex: 1
    }}>
      <View style={{
        flex: 1,
        backgroundColor: theme.background_color
      }}>

        <FlatList

        refreshControl={
            <RefreshControl
              tintColor={theme.text_color}
              refreshing={loading}
              onRefresh={() => dispatch(FetchPostsAction(""))}
            />
          }
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => fetcchMorePosts()}
          renderItem={({ item, index }) => renderPosts(item, index)}
          style={{
            flex: 1
          }}
        />

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            handleStyle={{
              borderBottomWidth:2,
              borderColor: theme.text_color
            }}
            containerStyle={{
              flex:1
            }}
            backgroundStyle={{
              backgroundColor: theme.background_color,
              borderRadius:20
            }}
            style={{ flex: 1, backgroundColor: theme.secondary_background_color }}
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
          >

            <Replies
              postId={postId}
            />

          </BottomSheetModal>
          <BottomSheetModal
            style={{
              flex: 1,
            }}
            index={0}
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
           
            ref={repostSheetModalRef}
            snapPoints={snapPointsRepost}
          >
            <View style={{
              flex: 1,
              padding: 20,
              backgroundColor: theme.background_color
            }}>
              <TouchableOpacity
                onPress={() => onPressRepost()}
                style={{
                  padding: 20,
                  flexDirection:"row",
                  backgroundColor:theme.secondary_background_color,
                  width: "100%",
                  alignItems:'center',
                  borderRadius: 15,
                  marginVertical: 5
                }}>
                   <FontAwesome
                       // onPress={()=>props.onRepost(post._id)}
                        name="retweet"
                        style={{ marginRight: 10 }}
                        size={20}
                        color={theme.text_color}
                    />
                <Text style={{color: theme.text_color}}>Repost</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{
                padding: 20,
                flexDirection:"row",
                borderRadius: 15,
                backgroundColor: theme.secondary_background_color,
                width: "100%"
              }}>
                 <FontAwesome
                       // onPress={()=>props.onRepost(post._id)}
                        name="quote-left"
                        style={{ marginRight: 10 }}
                        size={20}
                        color={theme.text_color}
                    />
                <Text style={{color: theme.text_color}}>Repost with Qoute</Text>
              </TouchableOpacity>

            </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>


      </View>
    </GestureHandlerRootView>
  )
}

export default Home