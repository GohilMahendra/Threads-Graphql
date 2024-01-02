import axios from "axios";
import { BASE_URL } from "../globals/constants";
import { SignUpArgsType, UpdateArgsType } from "../types/User";
import { getToken } from "../globals/utilities";

export const loginUser = async (email: string, password: string) => {
    try {
        email = email.toLowerCase()
        const response = await axios.post(
            `${BASE_URL}login`,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
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
        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}

export const updateUser = async (args: UpdateArgsType) => {
    try {
        const token = await getToken()

        const formData = new FormData()
        if (args.fullname)
            formData.append("fullname", args.fullname)

        if (args.bio)
            formData.append("bio", args.bio)

        if (args.profile_picture)
            formData.append("profile_picture", args.profile_picture)

        const response = await axios.patch(BASE_URL + "users",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "token": token
                },
            })
        if (response.status == 200) {
            return response.data
        }
        else {
            return response.data
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}

export const verifyOtp = async (email: string, otp: string) => {
    try {
        const query = `${BASE_URL}verify`
        const response = await axios.post(query, {
            otp: otp,
            email: email
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
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

            throw new Error(response.data)
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
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
            throw new Error(response.data)
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
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
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}

export const getCurrentFollowings = async (pageSize: number = 10, lastOffset?: string) => {
    try {
        let quary = `${BASE_URL}followers?pageSize=${pageSize}`

        if (lastOffset) {
            quary = `${quary}&lastOffset=${lastOffset}`
        }
        const token = await getToken()
        const response = await axios.get(quary, {
            headers: {
                "Content-Type": "application/json",
                token: token
            }
        })

        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }

}
export const followUser = async (userId: string) => {
    try {
        const token = await getToken()
        const quary = `${BASE_URL}followers/${userId}`
        const response = await axios.post(quary, {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
            }
        )
        if (response.status == 200) {
            return response.data
        }
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }

}
export const unFollowUser = async (userId: string) => {
    try {
        const token = await getToken()
        const quary = `${BASE_URL}followers/${userId}`
        const response = await axios.delete(quary,
            {
                headers: {
                    "Content-Type": "application/json",
                    "token": token
                },
            }
        )
        if (response.status == 200) {
            return response.data
        }
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }

}

export const fetchUserLikedPosts = async ({
    pageSize = 10,
    lastOffset,
}: { pageSize: number, lastOffset?: string }) => {
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
            throw new Error(response.data)
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}

export const fetchUserRepliedPosts = async ({
    pageSize = 10,
    lastOffset,
}: { pageSize: number, lastOffset?: string }) => {
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
            throw new Error(response.data)
        }
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }
}

export const deleteReply = async (replyId: string) => {
    try {
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
        if (response.status == 200)
            return response.data
        else
            throw new Error(response.data)
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(error.response.status + error.response.data.message);
        } else if (error.request) {
            throw new Error("No Response from Server");
        } else {
            throw new Error("Error:" + error.message);
        }
    }

}