import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../globals/constants";
import { SignUpArgsType } from "../types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getToken = async () => {
    const token = await AsyncStorage.getItem("token")
    return token
}
export const loginUser = async (email: string, password: string) => {
    try {
        email = email.toLowerCase()
        const response = await axios.post(
            `${BASE_URL}login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        console.log(response)
        return response.data;
    }
    catch (error: any) {
        throw "Error " + JSON.stringify(error)
    }

}

export const signUpUser = async (args: SignUpArgsType) => {
    try {
        args.email = args.email.toLowerCase()
        const response = await axios.post(
            `${BASE_URL}register`,
            { ...args },
            { headers: { 'Content-Type': 'application/json' } }
        )
        console.log(response)
        return response.data
    }
    catch (error: any) {
        console.log(error)
        throw error?.response?.data;
    }
}

export const updateUser = async (args: any) => {
    try {
        const token = await getToken()
        const response = await axios.patch(BASE_URL + "users",
            {
                fullname: args.fullname,
                profile_picture: args.profile_picture,
                bio: args.bio
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": token
                },
            })

        console.log(response.request)
        if (response.status == 200) {
            return response.data
        }
        else {
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err: any) {
        console.log(JSON.stringify(err))

    }
}

export const fetchUserPosts = async ({
    pageSize = 10,
    lastOffset,
    post_type
}: { pageSize: number, lastOffset?: string, post_type: string }) => {
    try {
        const token = await getToken()

        let query = `${BASE_URL}users/posts?pageSize=${pageSize}`;

        if (lastOffset) {
            query += `&lastOffset=${lastOffset}`;
        }

        if (post_type === "Repost") {
            query += `&post_type=Repost`;
        }
        const response = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            // console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const deleteUserPost = async (postId: string) => {
    try {
        const token = await getToken()
        const quary = `${BASE_URL}posts/${postId}`
        const response = await axios.delete(quary, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            // console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const fetchUserById = async (userId: string) => {
    try {
        const token = await getToken()
        const url = `${BASE_URL}users/${userId}`
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            throw new Error(response.data)
        }
    }
    catch (err: any) {
        throw new Error(err)
    }
}

export const getCurrentFollowings = async(pageSize:number=10,lastOffset?:string) =>
{   
    try
    {
        let quary = `${BASE_URL}followers?pageSize=${pageSize}`

        // if(lastOffset)
        // {
        //     quary = `${quary}&lastOffset=${lastOffset}`
        // }
        const token = await getToken()
        const response = await axios.get(quary,{
            headers:{
                "Content-Type":"application/json",
                token: token
            }
        })

        if(response.status == 200)
        return response.data
        else
        throw new Error(response.data)
    }
    catch(err:any)
    {
        throw new Error(err)
    }

}
export const followUser = async(userId:string) =>
{   
    try
    {
        const token = await getToken()
        const quary = `${BASE_URL}followers/${userId}`
        const response = await axios.post(quary,{},
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": token
                },
            }
        )
        if(response.status == 200)
        return response.data
        else
        throw new Error(response.data)
    }
    catch(err:any)
    {
        throw new Error(err)
    }

}
export const unFollowUser = async(userId:string) =>
{   
    try
    {
        const token = await getToken()
        const quary = `${BASE_URL}followers/${userId}`
        const response = await axios.delete(quary,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": token
                },
            }
        )
        if(response.status == 200)
        return response.data
        else
        throw new Error(response.data)
    }
    catch(err:any)
    {
        throw new Error(err)
    }

}

export const fetchUserLikedPosts = async ({
    pageSize = 10,
    lastOffset,
}: { pageSize: number, lastOffset?: string}) => {
    try {
        const token = await getToken()

        let query = `${BASE_URL}liked_posts?pageSize=${pageSize}`;

        if (lastOffset) {
            query += `&lastOffset=${lastOffset}`;
        }
        const response = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            // console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const fetchUserRepliedPosts = async ({
    pageSize = 10,
    lastOffset,
}: { pageSize: number, lastOffset?: string}) => {
    try {
        const token = await getToken()

        let query = `${BASE_URL}replied_posts?pageSize=${pageSize}`;

        if (lastOffset) {
            query += `&lastOffset=${lastOffset}`;
        }
        const response = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        })
        if (response.status == 200) {
            return response.data
        }
        else {
            // console.log(response.data)
            throw Error(JSON.stringify(response.data))
        }
    }
    catch (err) {
        console.log(err)
        throw Error(JSON.stringify(err))
    }
}

export const deleteReply = async(replyId:string) =>
{   
    try
    {
        const token = await getToken()
        const quary = `${BASE_URL}replied_posts/${replyId}`
        const response = await axios.delete(quary,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": token
                },
            }
        )
        if(response.status == 200)
        return response.data
        else
        throw new Error(response.data)
    }
    catch(err:any)
    {
        throw new Error(err)
    }

}