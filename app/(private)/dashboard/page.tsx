"use client";

import { useCallback, useState } from "react";
import CreateMeetingModal from "./CreateMeetingModal";
import MeetingList from "./MeetingList";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Content from "@/app/components/layout/Content";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <Header>
        <div className={"flex items-center justify-between"}>
          <button>미팅 스케쥴러</button>
          <CreateMeetingModal onCreatedAction={handleCreated} />
        </div>
      </Header>
      <Sidebar>
        <div>사이드바</div>
      </Sidebar>
      <Content>
        <MeetingList refreshKey={refreshKey} />
      </Content>
    </>
  );
};

export default Dashboard;

