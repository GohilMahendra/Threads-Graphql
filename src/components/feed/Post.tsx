import React from "react";
import { Text,Image } from "react-native"
import { View } from "react-native"
import { placeholder_image } from "../../globals/asstes";
import GridViewer from "./GridViewer";

const Post = () =>
{

    const images = [
        "https://i.pinimg.com/736x/07/ee/2a/07ee2a0afee0f92a694f04c83cbd9b08.jpg",
        "https://i.pinimg.com/736x/82/63/4d/82634d5c835261a935746575bfc6cf66.jpg",
        // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrsRZVTev4tnYj8JcfpF8iNZLDa9g87FiIXA&usqp=CAU",
        // "https://www.usanetwork.com/sites/usablog/files/2023/05/suits-gabriel-macht.jpg"
    ]
    const onPressImage = () =>
    {

    }
    return(
        <View style={{
            padding:10,
            backgroundColor:"#fff",
            flexDirection:"row"
        }}>
           <Image
           source={placeholder_image}
           style={{
            height:40,
            width:40,
            borderRadius:40,
            marginRight:20
           }}
           />
           <View style={{
    
           }}>
            <View style={{
                flexDirection:'row'
            }}>
                <Text 
                style={{
                    color:"black",
                    fontWeight:"bold",
                    fontSize:15,
                    marginRight:10
                }}>Harvey spector</Text>
                <Text 
                style={{
                    color:"grey",
                    fontSize:15,
                }}>@Harveyspector</Text>
            </View>
            <Text style={{
                maxWidth:"90%"
            }}>A bunch of paragpah is going to herte syll checking if works ornot</Text>
            <GridViewer
            uris={images}
            />
           </View>
        </View>
    )

}
export default Post