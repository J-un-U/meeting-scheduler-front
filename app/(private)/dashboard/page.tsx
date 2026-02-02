"use client"

import { useState } from "react";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Content from "@/app/components/layout/Content";
import Modal from "@/app/components/Modal";
import { Field, Fieldset, Input, Label, Select, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { DatePicker } from "@/app/components/date-picker/DatePicker";

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
          <Fieldset>
            <Field>
              <Label className="text-sm/6 font-medium text-black">약속 제목</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                )}
              />
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">약속 설명</Label>
              <Textarea
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                )}
              />
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">달 선택</Label>
              <DatePicker mode={"month"}/>
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">최대 인원</Label>
              <Select
                className={clsx(
                  'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                  // Make the text of each option black on Windows
                  '*:text-black'
                )}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </Select>
            </Field>
          </Fieldset>
        </form>
      </Modal>
    </>
  )
};

export default Dashboard;
