import { View, Text, SafeAreaView, Vibration, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ProfileStacktype } from '../../navigations/ProfileStack'
import { FlatList } from 'react-native'
import { Thread } from '../../types/Post'
import ProfilePost from '../../components/profile/PofilePost'
import { DeletePostAction, FetchMoreUserPostsAction, FetchUserPostsAction } from '../../redux/slices/UserSlice'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import UseTheme from '../../globals/UseTheme'

const Profile = () => {

  const user = useSelector((state: RootState) => state.User.user)
  const posts = useSelector((state:RootState)=> state.User.Posts)
  const navigation = useNavigation<NavigationProp<ProfileStacktype, "Profile">>()
  const [selectedSection,setSelectedSection] = useState("Threads")
  const threeDotPressModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['30%'], []);
  const [postId,setPostId] = useState("")
  const { theme } = UseTheme()
  const handleThreedotPress = useCallback((postId:string)=>{
    setPostId(postId)
    threeDotPressModalRef.current?.present()
  },[])

  const onDeleteModalPress = async() =>
  {
    threeDotPressModalRef.current?.close()
    await dispatch(DeletePostAction({postId}))
    
  }
  const dispatch = useAppDispatch()
  const renderPosts = (item:Thread,index:number) =>
  {
    return(
      <ProfilePost
      post={item}
      onPressThreeDots={(postId:string)=>handleThreedotPress(postId)}
      />
    )
  }

  const loadMorePosts = async() =>
  {
    dispatch(FetchMoreUserPostsAction(""))
  }

  useEffect(()=>{
    dispatch(FetchUserPostsAction(""))
  },[])
  
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background_color
    }}>
      <ScrollView style={{
        flex: 1,
      }}>
        <View style={{
          flexDirection: 'row',
          padding: 20,
          justifyContent: 'flex-end'
        }}>
          <FontAwesome5Icon
            onPress={() => navigation.navigate("EditProfile")}
            name='edit'
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
          <Text style={{color: theme.text_color}}>{user.bio}</Text>
          <Text style={{color: theme.text_color}}>{user.followers} Followers</Text>
        </View>
        <View style={{
          marginTop:20,
          flexDirection:"row",
          justifyContent:'space-between'
        }}>
          <TouchableOpacity
          onPress={()=>setSelectedSection("Threads")}
          style={{
            paddingHorizontal:20,
            paddingVertical:10,
            justifyContent:"center",
            alignItems:"center",
            borderBottomWidth:(selectedSection == "Threads")?1:0,
            borderColor: theme.text_color
          }}
          >
            <Text style={{
              fontSize:15,
              color: theme.text_color
            }}>Threads</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>setSelectedSection("Reposts")}
          style={{
            paddingHorizontal:20,
            paddingVertical:10,
            justifyContent:"center",
            alignItems:"center",
            borderBottomWidth:(selectedSection == "Reposts")?1:0,
            borderColor: theme.text_color
          }}
          >
            <Text style={{
              fontSize:15,
              color: theme.text_color
            }}>Reposts</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>setSelectedSection("Replies")}
          style={{
            paddingHorizontal:20,
            paddingVertical:10,
            justifyContent:"center",
            alignItems:"center",
            borderBottomWidth:(selectedSection == "Replies")?1:0,
            borderColor: theme.text_color
          }}
          >
            <Text style={{
              fontSize:15,
              color: theme.text_color
            }}>Replies</Text>
          </TouchableOpacity>
        </View>
     { selectedSection=="Threads"  && <FlatList
        style={{
          padding:10
        }}
        data={posts}
        renderItem={({item,index})=>renderPosts(item,index)}
        onEndReached={()=>loadMorePosts()}
        />
      }
       
      </ScrollView>

    </SafeAreaView>
    <BottomSheetModalProvider>
          <BottomSheetModal
            ref={threeDotPressModalRef}
            snapPoints={snapPoints}
            backgroundStyle={
              {
                backgroundColor: theme.background_color,
              }
            }
          
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
            )}
          >
           <View style={{
           padding:20,
           justifyContent:'center',
           alignItems:'center'
           }}>
            <TouchableOpacity style={{
              padding:20,
              backgroundColor: theme.secondary_background_color,
              width:"100%",
              borderRadius:10,
              marginVertical:5
            }}>
              <Text
              style={{
                color: theme.text_color,
                fontSize:15,
                fontWeight:"bold"
              }}
              >Edit Thread</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={()=>onDeleteModalPress()}
            style={{
              padding:20,
              borderRadius:10,
              backgroundColor:'red',
              width:"100%"
            }}>
              <Text style={{
                color:"white",
                fontSize:15,
                fontWeight:"bold"
              }}>Delete Thread</Text>
            </TouchableOpacity>
           

           </View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
export default Profile