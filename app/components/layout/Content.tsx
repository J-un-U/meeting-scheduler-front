'use client';

import React from "react";

interface ContentProps {
  children: React.ReactNode;
}

const Content = ({ children }: ContentProps
) => <main className={"col-start-2 row-start-2 bg-green-100 px-6 py-4"}>{children}</main>;

export default Content;