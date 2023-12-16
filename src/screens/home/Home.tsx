import { View, Text } from 'react-native'
import React from 'react'
import Post from "../../components/feed/Post"
import AsyncStorage from '@react-native-async-storage/async-storage'

const  Home = () =>{


  const getToken = async()=>
  {
    const token = await AsyncStorage.getItem("token")
    return token
  }
  const getUser = async() =>
  {
   
  }
  const fetchPosts = async() =>
  {
    const token = getToken()
   
  }


  return (
    <View>
     
    </View>
  )
}

export default Home