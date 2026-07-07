import { TextareaHTMLAttributes } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type TextareaProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error: FieldErrors<T>;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea<T extends FieldValues>(props: TextareaProps<T>) {
  const { id, name, error, register, ...rest } = props;

  return (
    <>
      <textarea
        {...rest}
        id={id}
        className="min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
