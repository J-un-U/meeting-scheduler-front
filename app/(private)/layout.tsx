type Props = {
  children: React.ReactNode;
};

const PrivateLayout = async ({ children }: Props) => (
  <div className={"grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]"}>
    {children}
  </div>
);

export default PrivateLayout;