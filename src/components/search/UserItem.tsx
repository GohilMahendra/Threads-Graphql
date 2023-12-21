import React from "react";
import { TouchableOpacity,Image,View,Text} from "react-native"
import { SearchUser } from "../../types/User"
import { placeholder_image } from "../../globals/asstes";
type UserItemProps =
{
    user:SearchUser,
    onPress:(userId:string)=>void
}
const UserItem = (props:UserItemProps) =>
{
    const item  = props.user
    return(
        <TouchableOpacity style={{
            width: "100%",
            padding:10,
            borderBottomWidth:1,
            borderBottomColor:"silver",
            flexDirection: 'row',
            alignItems: "center"
          }}>
            <Image
              source={item.profile_picture ? { uri: item.profile_picture } : placeholder_image}
              style={{
                height: 40,
                backgroundColor: "transparent",
                width: 40,
                marginRight: 20,
                borderRadius: 40
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
          </TouchableOpacity>
    )
}
export default UserItem