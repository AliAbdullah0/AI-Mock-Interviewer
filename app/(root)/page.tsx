import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
            dummyInterviews.map((interview,i)=>(
              <InterviewCard {...interview} key={interview.id}/>
            ))
            }
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <h2>Take an Interview</h2>
          <div className="interviews-section">
          {
            dummyInterviews.map((interview,i)=>(
              <InterviewCard {...interview} key={interview.id}/>
            ))
          }
          {/* <p>You haven't taken any interviews yet.</p> */}
          </div>
        </section>
    </>
  );
}
