import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}:RouteParams) => {
    const {id} = await params;
    const user = await getCurrentUser()
    const interview = await getInterviewById(id);
    const feedback = await getFeedbackByInterviewId({
        interviewId:id,
        userId:user?.id!,
    })
    if(!interview) redirect('/')

  return (
    <>
        <div className='flex flex-row gap-4 justify-between'>
            <div className='flex flex-row gap-4 items-center'>
                <div className='flex flex-row gap-4 items-center'>
                    <Image src={getRandomInterviewCover()} alt='cover' height={40} width={40} className='rounded-full object-cover size-[40px]' />
                    <h3 className='capitalize'>{interview.role}</h3>

                </div>
                <DisplayTechIcons techStack={interview.techstack}/>
            </div>
            <p className='px-4 py-4 rounded-lg capitalize bg-dark-200 h-fit'>{interview.type}</p>
        </div>
        <Agent userName={user?.name} userId={user?.id} type='interview' questions={interview.questions} interviewId={interview.id} feedbackId={feedback?.id}/>
    </>
  )
}

export default Page