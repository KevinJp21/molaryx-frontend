type Props = {
  title: string;
  description: string;
};

export const AccountPlaceholderTemplate = ({ title, description }: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-8 sm:px-8 sm:py-10">
      <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight text-ink-50">
        {title}
      </h1>
      <p className="max-w-md text-center text-sm leading-relaxed text-ink-400">
        {description}
      </p>
    </div>
  );
};
