import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  constraints = {},
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Display error messages based on the type of error
  let errorBlock: React.ReactNode = null;
  if (errors[name]) {
    if (errors[name]?.type === 'validate') {
      const errorMessage = (errors[name]?.message as string) || '';
      const errorMessages = errorMessage.split('\n').filter((msg) => msg) || [];

      errorBlock = (
        <div className='grid w-full grid-cols-1 pt-1'>
          {errorMessages.map((msg, index) => {
            const key = `error-${name}-${index}`;
            return (
              // Each error is a row in the grid
              <div key={key} className='text-xs text-red-600'>
                {msg}
              </div>
            );
          })}
        </div>
      );
    } else {
      errorBlock = (
        <span className='pt-1 text-xs text-red-600'>
          {errors[name]?.message as string}
        </span>
      );
    }
  }

  return (
    <div className=''>
      <label htmlFor={name} className='text-ct-blue-600 mb-3 block'>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className='input w-full appearance-none rounded-2xl px-4 py-2 focus:outline-hidden'
        {...register(name, constraints)}
      />

      {errorBlock}
    </div>
  );
};

export default FormInput;
