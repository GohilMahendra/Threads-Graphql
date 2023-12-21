import { View, FlatList, Button, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { CompositeNavigationProp, NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackType } from '../../navigations/RootStack'
import { UserTabType } from '../../navigations/UserTab'
import { BASE_URL } from '../../globals/constants'
import { Thread } from '../../types/Post'
import PostItem from '../../components/feed/PostItem'
import { fetchPosts } from '../../apis/FeedAPI'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { FetchMorePostsAction, FetchPostsAction } from '../../redux/slices/FeedSlice'
import Replies from '../../components/feed/Replies'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { Text } from 'react-native-elements'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
const Home = () => {

  type compisetNavigation = CompositeNavigationProp<NavigationProp<RootStackType>, NavigationProp<UserTabType>>
  const navigation = useNavigation<compisetNavigation>()
  const posts = useSelector((state: RootState) => state.Feed.Threads)
  const dispatch = useAppDispatch()
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const repostSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['90%', '20%'], []);
  const [postId,setPostId] = useState("")
  const snapPointsRepost = useMemo(() =>["30%"],[])

  const handleRepostModal = useCallback(()=>{
    repostSheetModalRef.current?.present()
  },[])
  const handlePresentModalPress = useCallback((postId:string) => {
    setPostId(postId)
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderPosts = (item: Thread, index: number) => {
    return (
      
      <PostItem
        onPressComment={handlePresentModalPress}
        onRepost={handleRepostModal}
        key={item._id}
        post={item}
      />
    )
  }
  const fetcchMorePosts = async() =>
  {
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
      }}>

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item,index) => index.toString()}
          onEndReached={()=>fetcchMorePosts()}
          renderItem={({ item, index }) => renderPosts(item, index)}
          style={{
            flex: 1
          }}

        />


        <BottomSheetModalProvider>
          <BottomSheetModal
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} style={{
                backgroundColor:"rgba(0,0,0,0,1)"
              }} />
            )}
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
          >
            
            <Replies
              postId={postId}
            />
          </BottomSheetModal>
          <BottomSheetModal
          
            style={{
              flex:1,
              backgroundColor:"transparent"
            }}
            ref={repostSheetModalRef}
            snapPoints={snapPointsRepost}
          >
           <View style={{
           flex:1,
           padding:20
           }}>
            <TouchableOpacity style={{
              padding:20,
              backgroundColor:'#f5f5f5',
              width:"100%",
              borderRadius:15,
              marginVertical:5
            }}>
              <Text>Repost</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              padding:20,
              borderRadius:15,
              backgroundColor:'#f5f5f5',
              width:"100%"
            }}>
              <Text>Repost with Qoute</Text>
            </TouchableOpacity>
            
           </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>


      </View>
    </GestureHandlerRootView>
  )
}

export default Home