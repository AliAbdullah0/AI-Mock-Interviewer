
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const RootLayout = async ({children}:{
    children:React.ReactNode
}) => {
  const isUserAuthenticated = await getCurrentUser()
  if(!isUserAuthenticated) redirect('/sign-in')
  return (
    <div className='root-layout'>
      <nav className='flex items-center justify-between gap-2'>
        <div className="flex items-center gap-2 ">
        <Link href={'/'} className='flex items-center gap-2'>
          <Image
          src={'/logo.svg'}
          alt='Logo'
          width={38}
          height={32}
          />
        </Link>
        <h2 className='text-primary-100'>X Interview</h2>
        </div>
        <div className='flex items-center gap-2'>
          <Link href={'/'}><Button variant={'secondary'}>Home</Button></Link>
          <Link href={'/interview'}><Button variant={'secondary'}>Create Interview</Button></Link>
        </div>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout