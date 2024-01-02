import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity, StyleSheet,StatusBar, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SearchUser } from '../../types/User'
import { RootState, useAppDispatch } from '../../redux/store'
import { useSelector } from 'react-redux'
import { SearchUserAction } from '../../redux/actions/SearchActions'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
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
          ListHeaderComponent={() => searchTerm &&
            <TouchableOpacity 
            onPress={()=>navigation.navigate("PostSearch",{
              searchTerm: searchTerm
            })}
            style={[styles.headerList, {
              backgroundColor: theme.background_color,
              borderColor: theme.secondary_text_color,
            }]}>
              <View style={styles.headerListInnerConrainer}>
                <FontAwesome
                  name='search'
                  size={scaledFont(20)}
                  color={theme.text_color}
                />
                <Text style={[styles.textTerm, { color: theme.text_color }]}>Search for {searchTerm}</Text>
              </View>
              <FontAwesome
                name='angle-right'
                size={scaledFont(25)}
                color={theme.text_color}
              />
            </TouchableOpacity>
          }
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
    marginBottom: 10,
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
  },
  headerList:
  {
    padding: 10,
    paddingVertical: 20,
    justifyContent: "space-between",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    alignItems: "center"
  },
  headerListInnerConrainer:
  {
    flexDirection: 'row',
    alignItems: 'center', 
    flexWrap:"wrap"
  },
  textTerm:
  {
    fontSize: scaledFont(15),
    marginLeft: 20,
   
  }
})