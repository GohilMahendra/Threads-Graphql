import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { CompositeNavigationProp, NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackType } from '../../navigations/RootStack'
import { UserTabType } from '../../navigations/UserTab'
import { BASE_URL } from '../../globals/constants'
import { Thread } from '../../types/Post'
import PostItem from '../../components/feed/PostItem'
import { fetchPosts } from '../../apis/FeedAPI'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../../redux/store'
import { FetchPostsAction } from '../../redux/slices/FeedSlice'
import Replies from '../../components/feed/Replies'

const Home = () => {

  type compisetNavigation = CompositeNavigationProp<NavigationProp<RootStackType>, NavigationProp<UserTabType>>
  const navigation = useNavigation<compisetNavigation>()
  const posts = useSelector((state:RootState)=>state.Feed.Threads)
  const dispatch = useAppDispatch()
 
  return (
    <View style={{
      flex: 1,
    }}>
     
     <Replies/>
    </View>
  )
}

export default Home