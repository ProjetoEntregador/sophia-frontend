import { LabelHTMLAttributes } from "react";
import { FieldValues, Path } from "react-hook-form";

type LabelProps<T extends FieldValues> = {
  children: string;
  htmlFor: Path<T>;
} & LabelHTMLAttributes<HTMLLabelElement>;

export function Label<T extends FieldValues>(props: LabelProps<T>) {
  const { htmlFor, children, ...rest } = props;

  return (
    <label
      {...rest}
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-slate-700"
    >
      {children}
    </label>
  );
}
