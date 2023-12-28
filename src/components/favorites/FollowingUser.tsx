import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native"
import { SearchUser, User } from "../../types/User"
import { placeholder_image } from "../../globals/asstes";
import UseTheme from "../../globals/UseTheme";
import { useAppDispatch } from "../../redux/store";
import { followUserAction, unFollowUserAction } from "../../redux/actions/FavoriteActions";
type UserItemProps =
  {
    user: User,
    onPress: (userId: string) => void
  }
const FollowingUser = (props: UserItemProps) => {
  const item = props.user
  const { theme } = UseTheme()
  const dispatch = useAppDispatch()
  const onPressFollow = async () => {
    if (item.isFollowed) {
      dispatch(unFollowUserAction({ userId: item._id }))
    }
    else
      dispatch(followUserAction({
        userId: item._id
      }))
  }
  return (
    <TouchableOpacity
      onPress={() => props.onPress(item._id)}
      style={styles.container}>
      <View style={styles.rowContainer}>
        <Image
          source={item.profile_picture ? { uri: item.profile_picture } : placeholder_image}
          style={styles.imageUser} />
        <View>
          <Text style={[styles.txtFullname, { color: theme.text_color }]}>{item.fullname}</Text>
          <Text style={[styles.txtUsername, { color: theme.secondary_text_color }]}>{item.username}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onPressFollow()}
        style={[styles.btnFollow, {
          backgroundColor: item.isFollowed ? theme.background_color : theme.text_color,
          borderColor: theme.text_color,
          borderWidth: item.isFollowed ? 1 : 0
        }]}>
        <Text style={{
          color: item.isFollowed ? theme.text_color : theme.background_color
        }}>{item.isFollowed ? "Following" : "Follow"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}
export default FollowingUser
const styles = StyleSheet.create({
  container:
  {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "silver",
    justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: "center"
  },
  rowContainer:
  {
    flexDirection: 'row'
  },
  imageUser:
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
    fontSize: 15
  },
  btnFollow:
  {
    padding: 10,
    borderRadius: 10
  }
})