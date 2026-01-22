'use client';

import React, { useState, useLayoutEffect } from "react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [gnbHeight, setGnbHeight] = useState(0);

  // useEffect 대신 useLayoutEffect를 쓰면 화면 깜빡임을 더 줄일 수 있습니다.
  useLayoutEffect(() => {
    const updateHeight = () => {
      const gnbElement = document.querySelector(".gnb") as HTMLElement;
      if (gnbElement) {
        setGnbHeight(gnbElement.offsetHeight);
      }
    };

    // 컴포넌트가 마운트된 직후 높이 계산
    updateHeight();

    // 리사이즈 이벤트 대응
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <nav
      className="col-start-1 row-start-2 bg-green-300 w-20"
      style={{
        height: `calc(100vh - ${gnbHeight}px)`,
        position: 'sticky',
        top: `${gnbHeight}px`,
        left: 0
      }}
    >
      {children}
    </nav>
  );
};

export default Sidebar;