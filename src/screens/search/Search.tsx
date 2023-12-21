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

const Search = () => {

  const [searchTerm, setSearchTerm] = useState<string>("")
  const Users = useSelector((state: RootState) => state.Search.users)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (searchTerm != "")
      dispatch(SearchUserAction({
        name: searchTerm
      }))
  }, [searchTerm])

  const renderUsers = (item: SearchUser, index: number) => {
    return (
      <UserItem
      user={item}
      onPress={(userId)=>console.log(userId)}
      />
    )
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#fff',
      padding:10,
    }}>
      <View style={{
        backgroundColor: "#e5e5e5",
        width: "95%",
        padding: 15,
        flexDirection:'row',
        borderRadius: 10
      }}
      >
        <FontAwesome5Icon
        name='search'
        size={20}
        color={"white"}
        />
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholder={"search ..."}
          placeholderTextColor={"silver"}
          style={{
            fontSize: 15,
            marginLeft:20,
            color: "black",
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