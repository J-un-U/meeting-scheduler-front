type Props = {
  children: React.ReactNode;
};

const PublicLayout = async ({ children }: Props) => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50">
    {children}
  </div>
);

export default PublicLayout;