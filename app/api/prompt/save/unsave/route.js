//patch

import { connectToDB } from "@utils/database";
import User from '@models/user'
import Prompt from "@models/prompt";


export const PATCH = async (request, { params }) => {
    const { userId, postId } = await request.json()

    console.log(userId)
    console.log(postId)

    try {
        await connectToDB()

        
        const post = await Prompt.findById(postId)
        


        if(!userId || !post) return new Response("not found", { status: 404}) 

        
        post.usersSaved = post.usersSaved.filter((savedUserId) => savedUserId !== userId);

        


        
        await post.save()

        return new Response(JSON.stringify(post), {status: 200})

    } catch (error) {
        return new Response("failed to update user", {status: 500})
        
    }

}