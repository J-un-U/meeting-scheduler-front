'use client';

import React from "react";

interface HeaderProps {
  children: React.ReactNode;
}

const Header = ({ children }: HeaderProps
) => <nav className={"gnb bg-green-500 px-6 py-4"}>{children}</nav>;

export default Header;