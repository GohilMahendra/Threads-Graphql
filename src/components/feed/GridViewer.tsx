import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { getMediaImage } from "../../globals/utilities";
import { Media } from "../../types/Post";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import VideoPlayer from "./VideoPlayer";
type GridViewerPropTypes =
    {
        media: Media[],
    }

const GridViewer = (props: GridViewerPropTypes) => {

    const images = props.media
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
    const onSelectMedia = (media: Media) => {
        setTimeout(() => {
            setSelectedMedia(media)
        }, 500);
    }
    return (
        <View style={style.container}>
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
                            onPress={() => onSelectMedia(images[index])}
                            key={image._id}>
                            <Image
                                resizeMode="contain"
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
                onRequestClose={() => setSelectedMedia(null)}
            >
                {selectedMedia && <View style={style.previewContainer}>
                    <View style={style.cancelContainer}>
                        <Fontisto
                            onPress={() => setSelectedMedia(null)}
                            name="close"
                            color={"white"}
                            size={30}
                        />

                    </View>
                    {selectedMedia.media_type.includes("image") && <Image
                        source={{
                            uri: (selectedMedia.media_type.includes("image"))
                                ? selectedMedia.media_url : selectedMedia.thumbnail
                        }}
                        resizeMode={"contain"}
                        style={{
                            flex: 1,
                        }}
                    />
                    }
                    {selectedMedia.media_type.includes("video") && <VideoPlayer
                        uri={selectedMedia.media_url}
                    />
                    }
                </View>
                }
            </Modal>

        </View>
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
        flexDirection: 'row'
    },
    image2x:
    {
        height: 200,
        borderRadius: 15,
        width: "100%"
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
        height: 200,
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
        height: 100,
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
        height: 100,
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
        right: 20,
        top: 30,
        zIndex: 1000,
    }
})