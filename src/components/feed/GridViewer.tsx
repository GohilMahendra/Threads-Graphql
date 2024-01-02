import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { getMediaImage, scaledFont } from "../../globals/utilities";
import { Media } from "../../types/Post";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import VideoPlayer from "./VideoPlayer";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';
type GridViewerPropTypes =
    {
        media: Media[],
    }

const GridViewer = (props: GridViewerPropTypes) => {

    const images = props.media
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
    const scale = useSharedValue(1)
    const savedScale = useSharedValue(1)
    const onSelectMedia = (media: Media) => {
        setTimeout(() => {
            setSelectedMedia(media)
        }, 500);
    }
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.5,Math.min(3,savedScale.value * e.scale))
    })
    .onEnd(() => {
        scale.value = withSpring(1)
    });
    
    return (
        <GestureHandlerRootView style={style.container}>
            {images.length == 1 && <TouchableOpacity
                onPress={() => onSelectMedia(images[0])}
            >
                <Image
                    source={{ uri: getMediaImage(images[0]) }}
                    style={style.image1x}
                />
                {
                    images[0].media_type.includes("video")
                    &&
                    <FontAwesome5Icon
                        name="play"
                        color={"white"}
                        size={20}
                        style={style.playIcon}
                    />
                }
            </TouchableOpacity>
            }
            {images.length == 2 && <View style={style.container2x}>
                {
                    images.map((image, index) => (
                        <TouchableOpacity
                            style={{ width: "50%" }}
                            onPress={() => onSelectMedia(images[index])}
                            key={image._id}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: getMediaImage(image) }}
                                style={style.image2x}
                            />
                            {
                                image.media_type.includes("video")
                                &&
                                <FontAwesome5Icon
                                    name="play"
                                    color={"white"}
                                    size={20}
                                    style={style.playIcon}
                                />
                            }
                        </TouchableOpacity>
                    ))
                }
            </View>
            }
            {images.length == 3 && <View style={style.container3x}>
                <TouchableOpacity
                    onPress={() => onSelectMedia(images[0])}
                    key={images[0]._id}
                    style={style.btnimage3x1st}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: getMediaImage(images[0]) }}
                        style={style.image3x1st}
                    />
                    {
                        images[0].media_type.includes("video")
                        &&
                        <FontAwesome5Icon
                            name="play"
                            color={"white"}
                            size={20}
                            style={style.playIcon}
                        />
                    }
                </TouchableOpacity>
                <View style={style.container3x2nd}>
                    {images.map((image, index) => (
                        index != 0 && <TouchableOpacity
                            onPress={() => onSelectMedia(images[index])}
                            key={image._id}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: getMediaImage(image) }}
                                style={style.image3xRest}
                            />
                            {
                                image.media_type.includes("video")
                                &&
                                <FontAwesome5Icon
                                    name="play"
                                    color={"white"}
                                    size={20}
                                    style={style.playIcon}
                                />
                            }
                        </TouchableOpacity>
                    ))
                    }
                </View>
            </View>
            }
            {images.length == 4 && <View style={style.container4x}>
                {
                    images.map((image, index) => (
                        <TouchableOpacity
                            style={{ margin: 2, width: "48%" }}
                            onPress={() => onSelectMedia(images[index])}
                            key={image._id}>
                            <Image
                                resizeMode="contain"
                                source={{ uri: getMediaImage(image) }}
                                style={style.image4x}
                            />
                            {
                                image.media_type.includes("video")
                                &&
                                <FontAwesome5Icon
                                    name="play"
                                    color={"white"}
                                    size={20}
                                    style={style.playIcon}
                                />
                            }
                        </TouchableOpacity>
                    ))
                }
            </View>
            }
            <Modal
                visible={selectedMedia != null}
                animationType="fade"
                onRequestClose={() => {setSelectedMedia(null),scale.value = 1}}
            >
                {selectedMedia && <View style={style.previewContainer}>
                    <View style={style.cancelContainer}>
                        <Fontisto
                            onPress={() => {setSelectedMedia(null),scale.value = 1}}
                            name="close"
                            color={"white"}
                            size={30}
                        />

                    </View>
                    {selectedMedia.media_type.includes("image") &&
                        <GestureDetector gesture={pinchGesture}>
                        <Animated.View style={[animatedStyle,{flex:1}]}>
                            <Image
                                source={{
                                    uri: (selectedMedia.media_type.includes("image"))
                                        ? selectedMedia.media_url : selectedMedia.thumbnail
                                }}
                                resizeMode={"contain"}
                                style={{
                                    flex: 1,
                                }}
                            />
                        </Animated.View>
                        </GestureDetector>
                    }
                    {selectedMedia.media_type.includes("video") && <VideoPlayer
                        uri={selectedMedia.media_url}
                    />
                    }
                </View>
                }
            </Modal>

        </GestureHandlerRootView>
    )
}
export default GridViewer

const style = StyleSheet.create({
    container:
    {
        marginVertical: 5
    },
    image1x:
    {
        // height: 200,
        aspectRatio: 1,
        borderRadius: 15,
        width: "100%"
    },
    container2x:
    {
        flexWrap: "wrap",
        flexDirection: 'row',
        width: '100%',
    },
    image2x:
    {
        height: scaledFont(200),
        borderRadius: 15,
        width: "100%",
    },
    container3x:
    {
        flexDirection: 'row',
        width: "100%"
    },
    btnimage3x1st:
    {
        aspectRatio: 1,
        width: "50%",
        margin: 2
    },
    image3x1st:
    {
        height: scaledFont(200),
        borderRadius: 15,
        margin: 2,
        width: "100%"
    },
    container3x2nd:
    {
        width: "48%"
    },
    image3xRest:
    {
        height: scaledFont(100),
        margin: 2,
        borderRadius: 15,
        width: "100%"
    },
    container4x:
    {
        flexDirection: 'row',
        flexWrap: "wrap"
    },
    image4x:
    {
        height: scaledFont(100),
        borderRadius: 15,
        width: "100%"
    },
    playIcon:
    {
        top: "50%",
        alignSelf: "center",
        position: "absolute",
        zIndex: 1000
    },
    previewContainer:
    {
        flex: 1,
        backgroundColor: "black"
    },
    cancelContainer:
    {
        position: "absolute",
        right: scaledFont(20),
        top: scaledFont(30),
        zIndex: 1000,
    }
})