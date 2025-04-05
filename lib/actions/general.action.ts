"use server"

import { db } from "@/firebase/admin"
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { feedbackSchema } from "@/constants"

export const getInterviewById = async (id: string): Promise<Interview | null> => {
    const interview = await db.collection('interviews').doc(id).get()

    return interview.data() as Interview | null;
}

export const createFeedback = async (params: CreateFeedbackParams) => {
    const { interviewId, userId, transcript } = params;
    try {
        const formattedTranscript = transcript.map((senternce: { role: string; content: string }) => (
            `- ${senternce.role}: ${senternce.content}\n`
        )).join('')

        const { object:{totalScore,categoryScores,areasForImprovement,strengths,finalAssessment} } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false
            }),
            schema: feedbackSchema,
            prompt: `
            You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
            Transcript:
            ${formattedTranscript}

            Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
            - **Communication Skills**: Clarity, articulation, structured responses.
            - **Technical Knowledge**: Understanding of key concepts for the role.
            - **Problem-Solving**: Ability to analyze problems and propose solutions.
            - **Cultural & Role Fit**: Alignment with company values and job role.
            - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
            `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        try {
            const feedback = await db.collection('feedback').add({
              interviewId,
              userId,
              totalScore,
              strengths,
              areasForImprovement,
              finalAssessment,
              createdAt: new Date().toISOString()
            });
            return { success: true, feedbackId: feedback.id };
          } catch (firestoreErr) {
            console.log("Firestore error:", firestoreErr);
            return { success: false };
          }
          
    } catch (error) {
        console.log(error);
        return {
            success:false,
        }
    }
}

export const getFeedbackByInterviewId = async (params:GetFeedbackByInterviewIdParams):Promise<Feedback|null>=>{
    const {interviewId,userId} = params
    const feedback = await db.collection('feedback')
    .where('interviewId','==',interviewId)
    .where('userId','==',userId)
    .limit(1)
    .get()

    if(feedback.empty) return null
    const feedbackDoc = feedback.docs[0];

    return {
        id:feedbackDoc.id,
        ...feedbackDoc.data()
    } as Feedback
}