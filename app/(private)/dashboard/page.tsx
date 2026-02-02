"use client"

import dayjs from "dayjs";
import { FormEvent, useRef, useState } from "react";
import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import Content from "@/app/components/layout/Content";
import Modal from "@/app/components/Modal";
import { Field, Fieldset, Input, Label, Select, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { DatePicker } from "@/app/components/date-picker/DatePicker";

const Dashboard = () => {
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [month, setMonth] = useState<dayjs.Dayjs | null>(null);
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    month?: string;
    maxParticipants?: string;
  }>({});
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const monthFieldRef = useRef<HTMLDivElement | null>(null);
  const maxParticipantsRef = useRef<HTMLSelectElement | null>(null);

  const openCreateMeeting = () => {
    setIsCreateMeetingOpen(true);
  };

  const closeCreateMeeting = () => {
    setIsCreateMeetingOpen(false);
  };

  const createMeeting = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      title?: string;
      description?: string;
      month?: string;
      maxParticipants?: string;
    } = {};

    if (!title.trim()) {
      nextErrors.title = "필수값 입력";
    }
    if (!description.trim()) {
      nextErrors.description = "필수값 입력";
    }
    if (!month) {
      nextErrors.month = "필수값 입력";
    }
    if (!maxParticipants) {
      nextErrors.maxParticipants = "필수값 입력";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      if (nextErrors.title) {
        titleRef.current?.focus();
      } else if (nextErrors.description) {
        descriptionRef.current?.focus();
      } else if (nextErrors.month) {
        monthFieldRef.current?.querySelector("button")?.focus();
      } else if (nextErrors.maxParticipants) {
        maxParticipantsRef.current?.focus();
      }

      return;
    }

    const payload = {
      title,
      description,
      ownerUserId: 1,
      meetingType: "DATE_RANGE",
      maxParticipants: Number(maxParticipants),
      agreedStartDate: month ? month.startOf("month").format("YYYY-MM-DD") : null,
      agreedEndDate: month ? month.endOf("month").format("YYYY-MM-DD") : null,
      agreedDate: null,
      startTime: null,
      endTime: null,
    };

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to create meeting.");
        return;
      }

      setTitle("");
      setDescription("");
      setMonth(null);
      setMaxParticipants("1");
      setErrors({});
      closeCreateMeeting();
    } catch (error) {
      console.error("Failed to create meeting.", error);
    }
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
        footer={
          <button
            type="submit"
            form="create-meeting-form"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
          >
            만들기
          </button>
        }
      >
        <form
          id="create-meeting-form"
          className={"flex flex-col gap-2"}
          onSubmit={createMeeting}
        >
          <Fieldset>
            <Field>
              <Label className="text-sm/6 font-medium text-black">약속 제목</Label>
              <Input
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-300',
                  errors.title && "outline outline-red-500"
                )}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                ref={titleRef}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title}</p>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">약속 설명</Label>
              <Textarea
                className={clsx(
                  'mt-3 block w-full rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-300',
                  errors.description && "outline outline-red-500"
                )}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }
                }}
                ref={descriptionRef}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">달 선택</Label>
              <div
                ref={monthFieldRef}
                className={clsx(
                  errors.month && "[&>div>button]:border-red-500"
                )}
              >
                <DatePicker
                  mode={"month"}
                  value={month}
                  onChange={(value) => {
                    setMonth(value);
                    if (errors.month) {
                      setErrors((prev) => ({ ...prev, month: undefined }));
                    }
                  }}
                />
              </div>
              {errors.month && (
                <p className="mt-1 text-xs text-red-600">{errors.month}</p>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">최대 인원</Label>
              <Select
                className={clsx(
                  'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-black',
                  'data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                  '*:text-black',
                  errors.maxParticipants && "outline outline-red-500"
                )}
                value={maxParticipants}
                onChange={(event) => {
                  setMaxParticipants(event.target.value);
                  if (errors.maxParticipants) {
                    setErrors((prev) => ({ ...prev, maxParticipants: undefined }));
                  }
                }}
                ref={maxParticipantsRef}
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
              {errors.maxParticipants && (
                <p className="mt-1 text-xs text-red-600">{errors.maxParticipants}</p>
              )}
            </Field>
          </Fieldset>
        </form>
      </Modal>
    </>
  )
};

export default Dashboard;
