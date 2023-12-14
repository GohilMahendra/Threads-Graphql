import { SafeAreaView, ScrollView, Image, Dimensions, View } from "react-native"
import VideoPlayer from "../../components/feed/VideoPlayer"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"

const { width, height } = Dimensions.get("screen")
const MediaViewer = () =>
{
    const media = [
    {
        type:"image/jpeg",
        url:"https://i.pinimg.com/736x/82/bd/ef/82bdef60bb32bab81a5d5f2c9cd8a3fe.jpg"
    },
    {
        type:"video/mp4",
        url:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
        type:"video/mp4",
        url:"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    {
        type:"image/jpeg",
        url:"https://st3.depositphotos.com/2056297/14633/i/450/depositphotos_146330135-stock-photo-portrait-of-sexy-man.jpg"
    }

]
    return(
        <SafeAreaView style={{
            flex:1,
            backgroundColor:"black"
        }}>
            <View style={{
                flexDirection:"row",
                justifyContent:'space-between',
                padding:20,
                position:"absolute"
            }}>
                <FontAwesome5Icon
                name="angle-left"
                size={20}
                color={"white"}
                />
            </View>
            <ScrollView 
            horizontal 
            pagingEnabled 
            contentContainerStyle={{
                alignItems:"center"
            }}
            style={{
                flex:1,
                flexDirection:"row",
            }}>
                {
                    media.map((file,index)=>(
                        file.type.includes("image") ?
                        <Image
                        key={file.url}
                        resizeMode="contain"
                        source={{uri:file.url}}
                        style={{
                            flex:1,
                            height:height,
                            width:width
                        }}
                        />:
                        <VideoPlayer
                        key={file.url}
                        uri={file.url}
                        />
                    ))
    
                   
                }

            </ScrollView>
        </SafeAreaView>
    )
}
export default MediaViewer