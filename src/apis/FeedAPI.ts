import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { BASE_URL } from "../globals/constants"
import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens"
import { bool } from "aws-sdk/clients/signer"
import { Media, UploadMedia } from "../types/Post"

const getToken = async () => {
    const token = await AsyncStorage.getItem("token")
    return token
}

type CreatePostArgs =
    {
        isRepost: boolean,
        media?: UploadMedia[],
        content?: string
    }

export const createPost = async (args: CreatePostArgs) => {
    try {
        const content = args.content
        const media = args.media
        const is_repost = args.media
        const token = await getToken()
        const hastags: string[] = []
        let formData = new FormData()

        if (is_repost) {
            formData.append("content", content)
            formData.append("is_repost", false)
            if (hastags.length > 0) {
                hastags.forEach((tag, index) => {
                    formData.append("hashtags", tag)
                })
            }
            if (media && media.length > 0) {
                media.forEach((file, index) => {
                    formData.append(`media`, file)
                })
            }

            const upload_post = await axios.post(BASE_URL + "posts",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'token': token
                    }
                }
            )
        }
        else {

        }

    }
    catch (err: any) {
        throw new Error(err)
    }
}


export const fetchPosts = async () => {
    try {
        const token = await getToken()
        const response = await axios.get(BASE_URL + "posts", {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response
        }
        else {
            console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const likePost = async (postId: string) => {
    try {
        const token = await getToken()
        const response = await axios.post(BASE_URL + `posts/${postId}/likes`, {}, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        if (response.status == 200) {
            return response.data
        }
        else {
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        throw Error(JSON.stringify(err))
    }
}

export const unLikePost = async (postId: string) => {
    try {
        const token = await getToken()
        const response = await axios.delete(BASE_URL + `posts/${postId}/likes`, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        if (response.status == 200) {
            return response.data
        }
        else {
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        throw Error(JSON.stringify(err))
    }
}

export const commentPost = async (postId: string, content: string) => {
    try {
        const token = await getToken()
        const response = await axios.post(BASE_URL + `posts/${postId}/replies`, {
            content: content
        }, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        if (response.status == 200) {
            return response.data.message
        } else {
            throw new Error(response.data)
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}

export const fetchComments = async (postId: string, pagesize: number = 10,offset: string|null = null) => {
    try {
        const token = await getToken()

        let quary: string = ""

        if (offset) {
            quary = BASE_URL + `posts/${postId}/replies?pageSize=${pagesize}&lastOffSet=${offset}`
        }
        else {
            quary = BASE_URL + `posts/${postId}/replies?pageSize=${pagesize}`
        }
        const response = await axios.get(quary, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })

        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (err: any) {
        throw new Error(err)
    }
}