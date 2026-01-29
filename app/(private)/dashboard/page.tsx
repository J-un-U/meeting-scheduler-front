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

      {/* -----------약속 만들기 모달----------- */}
      <Modal
        isOpen={isCreateMeetingOpen}
        onClose={closeCreateMeeting}
        size="sm"
        title="제목"
        footer={<button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white" onClick={closeCreateMeeting}>확인</button>}
      >
        <form className={"flex flex-col gap-2"}>
          <label htmlFor="title">약속 제목</label>
          <input id={"title"} type="text"/>
          <label htmlFor="description">약속 설명</label>
          <textarea id={"description"}/>
          <label htmlFor="title">최대 인원</label>
          <select id={"maxParticipants"}></select>
        </form>
      </Modal>
    </>
  )
};

export default Dashboard;
