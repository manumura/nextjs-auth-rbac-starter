import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  constraints = {}
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className=''>
      <label htmlFor={name} className='block text-ct-blue-600 mb-3'>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className='block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4'
        {...register(name, constraints)}
      />
      {errors[name] && (
        <span className='text-red-600 text-xs pt-1 block'>
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
