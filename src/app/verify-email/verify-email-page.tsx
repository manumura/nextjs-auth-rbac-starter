import clsx from 'clsx';
import React from 'react';

export default function VerifyEmailPage({ result }): React.ReactElement {
  console.log('result', result);
  const success = result === 'success';
  const message = success
    ? 'Email verified successfully'
    : 'Email verification failed';

  const messageBaseClasses = 'text-2xl font-semibold';
  const messageClasses = success
    ? clsx(messageBaseClasses, ' text-green-700')
    : clsx(messageBaseClasses, ' text-red-700');

  return (
    <section className='h-section bg-slate-200 pt-20'>
      <div className='mx-auto flex h-[20rem] max-w-4xl flex-col items-center justify-center rounded-md bg-slate-50'>
        <p className={messageClasses}>{message}</p>
        <div className='mt-4 text-xl'>
          {success ? (
            <a href='/login'>Click here to login</a>
          ) : (
            <a href='/'>Click here to return to Home</a>
          )}
        </div>
      </div>
    </section>
  );
}
