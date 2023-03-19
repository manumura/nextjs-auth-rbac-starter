import React from "react";
import { useFormContext } from "react-hook-form";

const FormSelect = ({
  label,
  name,
  options,
  constraints = {},
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="">
      <label htmlFor={name} className="text-ct-blue-600 mb-3 block">
        {label}
      </label>
      <select
        className="block w-full appearance-none rounded-2xl py-2 px-4 focus:outline-none"
        // value={value} onChange={onChange}
        {...register(name, constraints)}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <span className="block pt-1 text-xs text-red-600">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormSelect;
