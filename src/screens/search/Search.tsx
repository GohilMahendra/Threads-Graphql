import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SearchUser } from '../../types/User'
import { Image } from 'react-native'
import { placeholder_image } from '../../globals/asstes'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { SearchUserAction } from '../../redux/slices/SearchSlice'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import UserItem from '../../components/search/UserItem'
import UseTheme from '../../globals/UseTheme'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { SearchStackParams } from '../../navigations/SearchStack'

const Search = () => {

  const [searchTerm, setSearchTerm] = useState<string>("")
  const Users = useSelector((state: RootState) => state.Search.users)
  const navigation = useNavigation<NavigationProp<SearchStackParams,"Search">>()
  const dispatch = useAppDispatch()
  const { theme } = UseTheme()
  useEffect(() => {
    if (searchTerm != "")
      dispatch(SearchUserAction({
        name: searchTerm
      }))
  }, [searchTerm])

  const NavigateToUserProfile = (userId:string) =>
  {
     console.log("navigation called")
      navigation.navigate("UserProfile",{
        userId: userId
      })
  }
  const renderUsers = (item: SearchUser, index: number) => {
    return (
      <UserItem
      user={item}
      onPress={(userId)=>NavigateToUserProfile(userId)}
      />
    )
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background_color,
      padding:10,
    }}>
      <View style={{
        backgroundColor: theme.secondary_background_color,
       // width: "95%",
        margin:20,
        padding: 15,
        flexDirection:'row',
        borderRadius: 10
      }}
      >
        <FontAwesome5Icon
        name='search'
        size={20}
        color={theme.text_color}
        />
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholder={"search ..."}
          placeholderTextColor={theme.placeholder_color}
          style={{
            fontSize: 15,
            marginLeft:20,
            color: theme.text_color
          }}
        />
      </View>
      <View style={{
        flex: 1,
      }}>
        <FlatList
          data={Users}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => renderUsers(item, index)}
        />

      </View>
    </SafeAreaView>
  )
}

export default Search