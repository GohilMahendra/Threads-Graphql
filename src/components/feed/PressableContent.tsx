import React from "react";
import { TouchableOpacity, View } from "react-native";
import { scaledFont } from "../../globals/utilities";
import { Text } from "react-native-elements";
import UseTheme from "../../globals/UseTheme";

type PressableContentProps =
    {
        content: string
        onPressHashTag: (tag: string) => void
    }

const PressableContent = (props: PressableContentProps) => {
    const { content, onPressHashTag } = props

    const { theme } = UseTheme()
    const words = content.split(/\s+/);

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {words.map((word, index) => (
                <React.Fragment key={index}>
                    {word.startsWith('#') ? (
                        <TouchableOpacity onPress={() => onPressHashTag(word)}>
                            <Text style={{ color: 'blue', fontSize: scaledFont(13), fontWeight: 'bold' }}>{word} </Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={{ color: theme.text_color, fontSize: scaledFont(13) }}>{word}{' '}</Text>
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}
export default PressableContent