import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native"
import { SearchUser } from "../../types/User"
import { placeholder_image } from "../../globals/asstes";
import UseTheme from "../../globals/UseTheme";
type UserItemProps =
  {
    user: SearchUser,
    onPress: (userId: string) => void
  }
const UserItem = (props: UserItemProps) => {
  const item = props.user
  const { theme } = UseTheme()
  return (
    <TouchableOpacity
      onPress={() => props.onPress(item._id)}
      style={styles.container}>
      <Image
        source={item.profile_picture ? { uri: item.profile_picture } : placeholder_image}
        style={styles.imgUser}></Image>
      <View>
        <Text style={[styles.txtFullname, { color: theme.text_color }]}>{item.fullname}</Text>
        <Text style={[styles.txtUsername, { color: theme.secondary_text_color }]}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  )
}
export default UserItem
const styles = StyleSheet.create({
  container:
  {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "silver",
    flexDirection: 'row',
    alignItems: "center"
  },
  imgUser:
  {
    height: 40,
    backgroundColor: "transparent",
    width: 40,
    marginRight: 20,
    borderRadius: 40
  },
  txtFullname:
  {
    fontSize: 18,
  },
  txtUsername:
  {
    fontSize: 15,
  }

})