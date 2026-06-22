import { InputHTMLAttributes } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type CheckboxProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldErrors<T>;
} & InputHTMLAttributes<HTMLInputElement>;

export function Checkbox<T extends FieldValues>(props: CheckboxProps<T>) {
  const { id, name, error, register, ...rest } = props;

  return (
    <>
      <input
        {...rest}
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
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
