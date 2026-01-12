type Props = {
  children: React.ReactNode;
};

const PrivateLayout = async ({ children }: Props) => (
  <div>
    {children}
  </div>
);

export default PrivateLayout;