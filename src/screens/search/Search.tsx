import { View, Text, SafeAreaView, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SearchUser } from '../../types/User'
import { Image } from 'react-native'
import { placeholder_image } from '../../globals/asstes'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { SearchUserAction } from '../../redux/slices/SearchSlice'

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
      <View style={{
        width: "100%",
        flexDirection: 'row',
        alignItems: "center"
      }}>
        <Image
          source={item.profile_picture ? { uri: item.profile_picture } : placeholder_image}
          style={{
            height: 50,
            backgroundColor: "transparent",
            width: 50,
            marginRight: 20,
            borderRadius: 50
          }}></Image>
        <View>
          <Text style={{
            fontSize: 18,
            color: 'black'
          }}>{item.fullname}</Text>
          <Text style={{
            fontSize: 15,
            color: "grey"
          }}>{item.username}</Text>
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: '#fff'
    }}>
      <View style={{
        margin: 10,
        backgroundColor: "silver",
        width: "95%",
        padding: 10,
        borderRadius: 10
      }}
      >
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholder={"search ..."}
          style={{
            fontSize: 15,
            color: "black",
          }}
        />
      </View>
      <View style={{
        flex: 1
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