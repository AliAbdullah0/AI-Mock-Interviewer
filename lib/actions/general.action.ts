"use server"

import { db } from "@/firebase/admin"

export const getInterviewById = async (id:string):Promise<Interview|null>=>{
    const interview = await db.collection('interviews').doc(id).get()

    return interview.data() as Interview | null;
}