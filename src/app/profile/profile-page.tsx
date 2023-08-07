'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProfilePage({ user }) {
  const router = useRouter();

  const handleEdit = (): void => {
    router.push('/edit-profile');
  };

  const avatar = user?.imageUrl ? (
    <div className='avatar'>
      <div className='w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
        <Image alt="myAvatarImage" src={user.imageUrl} />
      </div>
    </div>
  ) : (
    <div className='avatar placeholder'>
      <div className='w-24 rounded-full bg-neutral-focus text-neutral-content ring ring-primary ring-offset-base-100 ring-offset-24'>
        <span className='text-3xl'>{user?.name?.substring(0, 2).toUpperCase()}</span>
      </div>
    </div> 
  );

  return (
    <section className='h-section bg-slate-200'>
      <div className='flex flex-col items-center py-20'>
        <div className='card m-5 w-3/4 max-w-screen-lg bg-slate-50 shadow-xl'>
          <div className='card-body'>
            <div className='card-title'>
              <h1>My Profile</h1>
            </div>
            <div className='grid auto-cols-auto grid-cols-5 gap-4'>
              <div className='text-right'>
                <h2>Image:</h2>
              </div>
              <div className='col-span-4'>
                {avatar}
              </div> 
              <div className='text-right'>
                <h2>Full Name:</h2>
              </div>
              <div className='col-span-4'>
                <h2>{user.name}</h2>
              </div>
              <div className='text-right'>Email:</div>
              <div className='col-span-4'>{user.email}</div>
              <div className='text-right'>
                <h3>Role:</h3>
              </div>
              <div className='col-span-4'>
                <h3>{user.role}</h3>
              </div>
            </div>
            <div className='card-actions justify-end'>
              <button className='btn' onClick={handleEdit}>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
