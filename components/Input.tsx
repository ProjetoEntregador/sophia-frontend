import { InputHTMLAttributes } from "react";
import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldErrors<T>;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input<T extends FieldValues>(props: InputProps<T>) {
  const { id, name, error, register, ...rest } = props;

  return (
    <>
      <input
        {...rest}
        id={id}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
        {...register(name)}
      />
      {error[name] ? (
        <p className="mt-2 text-sm text-rose-600">
          {error[name].message as string}
        </p>
      ) : null}
    </>
  );
}
