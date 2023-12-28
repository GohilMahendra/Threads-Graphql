import { View, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Thread } from '../../types/Post'
import PostItem from '../../components/feed/PostItem'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { FetchMorePostsAction, FetchPostsAction, LikeAction, unLikeAction } from '../../redux/slices/FeedSlice'
import Replies from '../../components/feed/Replies'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Text } from 'react-native-elements'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import RepostItem from '../../components/feed/RepostItem'
import { RefreshControl } from 'react-native'
import UseTheme from '../../globals/UseTheme'
import { createRepostAction } from '../../redux/slices/UserSlice'
import {useNavigation } from '@react-navigation/native'
import { compositeRootHomeStack } from '../../navigations/Types'
const Home = () => {
  const navigation = useNavigation<compositeRootHomeStack>()
  const { theme } = UseTheme()
  const posts = useSelector((state: RootState) => state.Feed.Threads)
  const loading = useSelector((state: RootState) => state.Feed.loading)
  const loadMoreloading = useSelector((state: RootState) => state.Feed.loadMoreLoading)
  const dispatch = useAppDispatch()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const repostSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['90%', '20%'], []);
  const [postId, setPostId] = useState("")
  const snapPointsRepost = useMemo(() => ["30%"], [])
  const [selectedField, setSelectedField] = useState<"for_me" | "following">("for_me")
  const handleRepostModal = useCallback((postId: string) => {
    setPostId(postId)
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

  const onPressQouteRepost = async () => {
    repostSheetModalRef.current?.close()
    console.log(postId, "postId")
    const Post = posts.find(post => post._id == postId)
    let Thread = Post
    if (Post?.Repost && Post.isRepost) {
      Thread = Post.Repost
    }

    console.log(Post, "post")

    if (Thread)
      navigation.navigate("QoutePost", {
        Thread: Thread
      })

  }

  const navigateToProfile = (userId: string) => {
    navigation.navigate("UserProfile", {
      userId: userId
    })
  }
  const onLikeToggle = (postId: string, state: "like" | "unlike") => {
    if (state == "like") {
      dispatch(LikeAction({ postId: postId }))
    }
    else {
      dispatch(unLikeAction({ postId: postId }))
    }
  }
  const renderPosts = (item: Thread, index: number) => {
    return (

      item.isRepost && item.Repost ?
        <RepostItem
          onLikeToggle={(postId, state) => onLikeToggle(postId, state)}
          onPressNavigate={(userId) => navigateToProfile(userId)}
          onPressComment={handlePresentModalPress}
          onRepost={handleRepostModal}
          key={item._id}
          post={item}
        />
        :
        <PostItem
          onLikeToggle={(postId, state) => onLikeToggle(postId, state)}
          onPressNavigate={(userId) => navigateToProfile(userId)}
          onPressComment={handlePresentModalPress}
          onRepost={handleRepostModal}
          key={item._id}
          post={item}
        />

    )
  }

  const fetcchMorePosts = async () => {
    await dispatch(FetchMorePostsAction({ post_type: selectedField }))
  }
  useEffect(() => {
    dispatch(FetchPostsAction({
      post_type: selectedField
    }))
  }, [selectedField])
  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView
        style={styles.container}
      >
        <View style={[styles.contentContainer, { backgroundColor: theme.background_color }]}>
          <View style={[styles.selectionContainer]}>
            <TouchableOpacity
              onPress={() => setSelectedField("for_me")}
              style={[styles.btnForYou, {
                borderColor: (selectedField == "for_me") ? theme.text_color : theme.secondary_text_color,
                borderBottomWidth: selectedField == "for_me" ? 1 : 0,
              }]}>
              <Text style={[styles.textForyou, { color: (selectedField == "for_me") ? theme.text_color : theme.secondary_text_color, }]}>For You</Text>

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedField("following")}
              style={[styles.btnFollowing, {
                borderColor: (selectedField == "following") ? theme.text_color : theme.secondary_text_color,
                borderBottomWidth: selectedField == "following" ? 1 : 0,
              }]}>
              <Text style={[styles.textFollowing, { color: (selectedField == "following") ? theme.text_color : theme.secondary_text_color, }]}>Following</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={theme.text_color}
                refreshing={loading}
                onRefresh={() => dispatch(FetchPostsAction({ post_type: selectedField }))}
              />
            }
            ListFooterComponent={() => loadMoreloading &&
              <ActivityIndicator
                animating
                color={theme.text_color}
                size={20}
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
              style={styles.sheetComment}
              handleStyle={[styles.sheetHandle, {
                backgroundColor: theme.secondary_background_color,
                borderColor: theme.text_color
              }]}
              handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
              )}
            >
              <Replies postId={postId} />
            </BottomSheetModal>
            <BottomSheetModal
              style={styles.sheetRepost}
              index={0}
              backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
              )}
              handleStyle={[styles.handleRepost, {
                backgroundColor: theme.secondary_background_color,
                borderColor: theme.text_color
              }]}
              handleIndicatorStyle={{ borderColor: theme.text_color, borderWidth: 2 }}
              ref={repostSheetModalRef}
              snapPoints={snapPointsRepost}
            >
              <View style={[styles.sheetOptionContainer, { backgroundColor: theme.secondary_background_color }]}>
                <TouchableOpacity
                  onPress={() => onPressRepost()}
                  style={[styles.btnRepost, { backgroundColor: theme.secondary_background_color, }]}>
                  <FontAwesome
                    // onPress={()=>props.onRepost(post._id)}
                    name="retweet"
                    style={{ marginRight: 10 }}
                    size={20}
                    color={theme.text_color}
                  />
                  <Text style={{ color: theme.text_color }}>Repost</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onPressQouteRepost()}
                  style={[styles.btnQouteRepost, { backgroundColor: theme.secondary_background_color, }]}>
                  <FontAwesome
                    // onPress={()=>props.onRepost(post._id)}
                    name="quote-left"
                    style={{ marginRight: 10 }}
                    size={20}
                    color={theme.text_color}
                  />
                  <Text style={{ color: theme.text_color }}>Repost with Qoute</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetModal>
          </BottomSheetModalProvider>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}
export default Home
const styles = StyleSheet.create({
  gestureContainer:
  {
    flex: 1
  },
  container:
  {
    flex: 1
  },
  contentContainer:
  {
    flex: 1
  },
  selectionContainer:
  {
    // padding:20,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center'
  },
  btnForYou:
  {
    padding: 10,
    paddingVertical: 15,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  textForyou:
  {
    fontSize: 15
  },
  btnFollowing:
  {
    padding: 10,
    paddingVertical: 15,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  textFollowing:
  {
    fontSize: 15
  },
  sheetComment:
  {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sheetHandle:
  {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sheetRepost:
  {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  handleRepost:
  {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  sheetOptionContainer:
  {
    flex: 1,
    padding: 20,
  },
  btnRepost:
  {
    padding: 20,
    flexDirection: "row",
    width: "100%",
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 5
  },
  btnQouteRepost:
  {
    padding: 20,
    flexDirection: "row",
    borderRadius: 15,
    width: "100%"
  }
})