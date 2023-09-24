'use client';

import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/next.svg';

export default function Navbar({ navItems }) {
  console.log('navItems Navbar2', navItems);
  // const { open, setOpen } = useDrawerOpenStore();
  // const toggleDrawer = (): void => setOpen(!open);

  const navItemsList = navItems.map((item: JSX.Element) => {
    return <li key={item.props.id}>{item}</li>;
  });

  // const adminButtons = isAdmin(user) ? (
  //   <li>
  //     <Link href='/users' className='text-neutral'>
  //       Users
  //     </Link>
  //   </li>
  // ) : null;
  // const buttons = user ? (
  //   <>
  //     {adminButtons}
  //     <li>
  //       <Link href='/profile' className='text-neutral'>
  //         Profile
  //       </Link>
  //     </li>
  //     <li>
  //       <LogoutButton />
  //     </li>
  //   </>
  // ) : (
  //   <>
  //     <li>
  //       <Link href='/register' className='text-neutral'>
  //         Register
  //       </Link>
  //     </li>
  //     <li>
  //       <LoginButton />
  //     </li>
  //   </>
  // );

  console.log('navItemsList Navbar2', navItemsList);

  const navbar = (
    <div className='w-full navbar'>
      <div className='flex-none lg:hidden'>
        <label htmlFor='my-drawer' className='btn btn-square btn-ghost'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='inline-block w-6 h-6 stroke-current'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M4 6h16M4 12h16M4 18h16'
            ></path>
          </svg>
        </label>
      </div>
      {/* Website logo */}
      <div className='mx-2 flex-1 px-2'>
        <div className='flex items-center'>
          <Link href='/'>
            <Image src={logo} height='20' alt='Logo' placeholder='empty' />
          </Link>
          <Link href='/'>
            <span className='pl-5 text-2xl font-semibold text-neutral'>
              MyApp
            </span>
          </Link>
        </div>
      </div>
      {/* Desktop menu only shows for lg and up devices */}
      <div className='hidden flex-none lg:block'>
        <ul className='menu menu-horizontal px-2'>{navItemsList}</ul>
      </div>
    </div>
  );

  return (
    <div className='drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='flex flex-col drawer-content'>{navbar}</div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer' className='drawer-overlay z-100'></label>
        <ul className='menu w-80 min-h-full bg-slate-100 p-4'>
          {navItemsList}
        </ul>
      </div>
    </div>
  );
}
