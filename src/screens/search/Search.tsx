import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SearchUser } from '../../types/User'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { SearchUserAction } from '../../redux/actions/SearchActions'
import AntDesign from 'react-native-vector-icons/AntDesign'
import UserItem from '../../components/search/UserItem'
import UseTheme from '../../globals/UseTheme'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { SearchStackParams } from '../../navigations/SearchStack'
import { scaledFont } from '../../globals/utilities'

const Search = () => {

  const [searchTerm, setSearchTerm] = useState<string>("")
  const Users = useSelector((state: RootState) => state.Search.users)
  const navigation = useNavigation<NavigationProp<SearchStackParams, "Search">>()
  const dispatch = useAppDispatch()
  const { theme } = UseTheme()
  useEffect(() => {
    if (searchTerm != "")
      dispatch(SearchUserAction({
        name: searchTerm
      }))
  }, [searchTerm])

  const NavigateToUserProfile = (userId: string) => {
    navigation.navigate("UserProfile", {
      userId: userId
    })
  }
  const renderUsers = (item: SearchUser, index: number) => {
    return (
      <UserItem
        user={item}
        onPress={(userId) => NavigateToUserProfile(userId)}
      />
    )
  }
  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: theme.background_color,
    }]}>
      <View style={[styles.searchContainer, {
        backgroundColor: theme.secondary_color,
      }]}
      >
        <AntDesign
          name='search1'
          size={scaledFont(20)}
          color={theme.placeholder_color}
        />
        <TextInput
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholder={"search ..."}
          placeholderTextColor={theme.placeholder_color}
          style={[styles.inputSearch, {
            color: theme.text_color
          }]}
        />
      </View>
      <View style={styles.listContainer}>
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
const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 10,
  },
  searchContainer:
  {
    // width: "95%",
    margin: 20,
    padding: 15,
    flexDirection: 'row',
    borderRadius: 10
  },
  inputSearch:
  {
    fontSize: scaledFont(15),
    marginLeft: scaledFont(20)
  },
  listContainer:
  {
    flex: 1,
  }
})