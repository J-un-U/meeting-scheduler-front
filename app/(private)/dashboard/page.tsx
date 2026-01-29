"use client"

import { useState } from "react";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Content from "@/app/components/layout/Content";
import Modal from "@/app/components/Modal";

const Dashboard = () => {
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);

  const openCreateMeeting = () => {
    setIsCreateMeetingOpen(true);
  };

  const closeCreateMeeting = () => {
    setIsCreateMeetingOpen(false);
  };

  return(
    <>
      <Header>
        <div className={"flex items-center justify-between"}>
          <button>미팅 스케쥴러</button>
          <button className={"bg-blue-600 text-white px-4 py-2 rounded-md"} onClick={openCreateMeeting}>약속만들기</button>
        </div>
      </Header>
      <Sidebar>
        <div>사이드바</div>
      </Sidebar>
      <Content>
        <div>내용</div>
      </Content>
      <Modal
        isOpen={isCreateMeetingOpen}
        onClose={closeCreateMeeting}
        size="sm"
        title="제목"
        footer={<button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white" onClick={closeCreateMeeting}>확인</button>}
      >
        <div>모달 내용</div>
      </Modal>
    </>
  )
};

export default Dashboard;
