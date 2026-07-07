type NotFoundProps = {
  text: string;
};

export function NotFound({ text }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-lg text-slate-500">{text}</p>
    </div>
  );
}
