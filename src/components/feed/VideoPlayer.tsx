import React, { useRef, useState }  from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Slider } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import Video from "react-native-video";
const {height,width} = Dimensions.get("screen")

type VideoPlayerPropTypes = 
{
    uri: string
}

const VideoPlayer = (props:VideoPlayerPropTypes) =>
{
    const uri = props.uri
    const [paused,setPaused]=useState(false)
    const  duration = useRef<number>(0)
    const [currentTime,setCurrentTime] = useState(0)
    const videoRef = useRef<Video|null>()
    const setDuration = (value:number) =>
    {
        duration.current = value
    }
    const togglePause = () =>
    {
        setPaused((prevState)=>!prevState)
    }
    const onProgress = (value:number) =>
    {
       setCurrentTime(value)
    }
    const onSlidingComplete = (value:number) =>
    {
        videoRef.current?.seek(value)
    }
    return(
            <View>
            <TouchableOpacity
            onPress={()=>togglePause()}
            >
            <Video
            ref = {ref=> videoRef.current = ref}
            repeat
            onError={(err)=>console.log(JSON.stringify(err))}
            onProgress={(progress)=>onProgress(progress.currentTime)}
            onLoad={(data)=>setDuration(data.duration)}
            paused={paused}
            resizeMode="contain"
            source={{uri: uri}}
            style={{
                height:height,
                width:width,

            }}
            />
            <Slider
            thumbStyle={{
                height:20,
                width:20,
                backgroundColor:"white"
            }}
            value={currentTime}
            onSlidingComplete={(value)=>onSlidingComplete(value)}
            maximumValue={duration.current}
            animationType="timing"
            animateTransitions
            style={{
                height:10,
                zIndex:100000,
                width: width*90/100,
                alignSelf:"center",
                position:"absolute",
                bottom:50,
            }}

            />
            {
                paused &&
                <FontAwesome5Icon
                name="play"
                style={{
                    position:"absolute",
                    top:height/2-20,
                    shadowOffset:{height:6,width:4},
                    shadowColor:"grey",
                    shadowOpacity:0.8,
                    alignSelf:'center'
                }}
                color={"#D3D3D3"}
                size={30}
                />
            }
            </TouchableOpacity>
            </View>

    )

}
export default VideoPlayer