import { View, Text, SafeAreaView, Vibration, Image } from 'react-native'
import React from 'react'
import { placeholder_image } from '../../globals/asstes'
const  Profile = () =>{
  return (
    <SafeAreaView style={{
      flex:1
    }}>
      <View style={{
        flex:1
      }}>
        <View style={{
          padding:20,
          flexDirection:"row",
          justifyContent:"space-between"

        }}>
          <View style={{
            maxWidth:"80%"
          }}>
            <Text style={{
              color:"black",
              fontWeight:"500",
              fontSize:25
            }}>Kunal Modi</Text>
            <Text style={{
              color:"black",
              fontWeight:"500",
              fontSize:20
            }}>kunalmodi</Text>
             <Text style={{
              color:"black",
              fontSize:15,
              marginTop:10
            }}>bio text very large string to be here and i am gere to get the disn shd yubs d</Text>
          </View>
          <Image
          source={placeholder_image}
          style={{
            height:70,
            borderRadius:70,
            width:70 
          }}
          />
        </View>

      </View>
    </SafeAreaView>
  )
}

export default Profile