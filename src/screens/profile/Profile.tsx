import { View, Text, SafeAreaView, Vibration, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { placeholder_image } from '../../globals/asstes'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ProfileStacktype } from '../../navigations/ProfileStack'

const Profile = () => {

  const user = useSelector((state: RootState) => state.User.user)
  const navigation = useNavigation<NavigationProp<ProfileStacktype, "Profile">>()
  const [selectedSection,setSelectedSection] = useState("Threads")
  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={{
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
            color={"black"}
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
                fontWeight: "bold"
              }}>{user.fullname}</Text>
              <Text>{user.username}</Text>
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
          <Text>{user.bio}</Text>
          <Text>{user.followers} Followers</Text>
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
            borderColor:"black"
          }}
          >
            <Text style={{
              fontSize:15
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
            borderColor:"black"
          }}
          >
            <Text style={{
              fontSize:15
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
            borderColor:"black"
          }}
          >
            <Text style={{
              fontSize:15
            }}>Replies</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default Profile