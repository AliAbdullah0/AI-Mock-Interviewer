"use server"

import { auth,db } from "@/firebase/admin";
import { cookies } from "next/headers";

const One_Week = 60 * 60 * 24 * 7;

export const signUp = async (params:SignUpParams) => {
    const { uid, name, email } = params;

    try {

        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists) {
            console.log("User already exists in Firestore:", uid);
            return { success: false, message: "User already exists!" };
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });
        return { success: true, message: 'Account Created Successfully. Please Sign In.' };
    } catch (error:any) {
        console.error("Error in signup:", {
            code: error.code,
            message: error.message,
            stack: error.stack,
        });
        return { success: false, message: "Failed to create an account!" };
    }
};

export const signIn = async (params:SignInParams)=>{
    const {email,idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email)
        if(!userRecord){
            return {
                success:false,
                message:'User doesnot exists.'                
            }
        }

        await setSessionCookie(idToken);

    } catch (error) {
        console.log(error)
        return {
            success:false,
            message:'Failed to log in.'
        }
    }
}

export const setSessionCookie = async (idToken:string)=>{
    const cookieStore = await cookies()
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn:One_Week * 1000,
    })

    cookieStore.set('session',sessionCookie,{
        maxAge:One_Week,
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'lax',
        path:'/'
    })
}

export const getCurrentUser = async ():Promise<User | null>=>{
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value;

    if(!sessionCookie){
        return null
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true)
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists){
            return null;
        }        
        return {
            ...userRecord.data(),
            id:userRecord.id
        } as User

    } catch (error) {
        console.log(error);
        return null
    }
}

export const isAuthenticated = async ()=>{
    const user = await getCurrentUser()

    return !!user;
}

export const getInterviewByUserId = async (userId:string):Promise<Interview[]|null>=>{
    const interviews =  await db.collection('interviews').where('userId','==',userId).orderBy('createdAt','desc').get()

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}


export const getLatestInterviews = async (params:GetLatestInterviewsParams):Promise<Interview[]|null>=>{
    const {userId,limit = 20 } = params
    const interviews =  await db.collection('interviews').where('finalized','==',true).where('userId','!=',userId).limit(limit).get()

    return interviews.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
    })) as Interview[];
}