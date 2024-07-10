'use client';

import { useQuery } from '@tanstack/react-query';
import LoadingOverlay from '../components/LoadingOverlay';
import { info, welcome } from '../lib/api';
import HomePage from './home-page';
import Error from './error';
import { InfoResponse } from '../types/custom-types';

export default function Home() {
  const {
    isPending,
    error,
    data: information,
  } = useQuery({
    queryKey: ['info'],
    queryFn: () => info().then((res) => res.data),
    initialData: {} as InfoResponse,
  });

  const {
    isPending: isPendingWelcome,
    error: errorWelcome,
    data: msg,
  } = useQuery({
    queryKey: ['welcome'],
    queryFn: () => welcome().then((res) => res.data),
    initialData: { message: 'Loading...' },
  });

  // if (isPending || isPendingWelcome) {
  //   return <LoadingOverlay label='Loading' />;
  // }

  if (error) {
    return <Error error={error} />;
  }

  if (errorWelcome) {
    return <Error error={errorWelcome} />;
  }

  // Forward fetched data to your Client Component
  return (
    <HomePage message={msg.message} information={information} />
  );
}
