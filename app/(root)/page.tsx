import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser()
  const [interviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id }),
  ]);
  
  const hasPastInterviews = interviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview Ready with AI Powered Practice & Feedback</h2>
          <p className="text-lg">Powered By Next.js and Vapi ai.</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href={'/interview'}>Start an Interview</Link>
          </Button>
        </div>
        <Image 
        src="/robot.png"
        alt="robo-dude" 
        width={400}
        height={400}
        className="max-sm:hidden"
        />
      </section>
        <section className="flex flex-col mt-8 gap-6 ">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
            {
            hasPastInterviews ? interviews?.map((interview,i)=>(
              <InterviewCard {...interview} key={interview.id}/>
            )):(
                <p>You haven&apos;t taken any interviews yet</p>
              )
            }
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="interviews-section">
          {
            hasUpcomingInterviews? latestInterviews?.map((interview,i)=>(
              <InterviewCard {...interview} key={interview.id}/>
            )):(
              <p>No Upcoming Interviews.</p>
            )
          }
          </div>
        </section>
    </>
  );
}
