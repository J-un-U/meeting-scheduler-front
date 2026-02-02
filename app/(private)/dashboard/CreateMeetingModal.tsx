"use client"

import dayjs from "dayjs";
import { FormEvent, useRef, useState } from "react";
import { Field, Fieldset, Input, Label, Select, Textarea } from "@headlessui/react";
import clsx from "clsx";
import Modal from "@/app/components/Modal";
import { DatePicker } from "@/app/components/date-picker/DatePicker";

type CreateMeetingModalProps = {
  onCreatedAction?: () => void;
};

export default function CreateMeetingModal({ onCreatedAction }: CreateMeetingModalProps) {
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [maxParticipants, setMaxParticipants] = useState("10");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    maxParticipants?: string;
  }>({});
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const dateFieldRef = useRef<HTMLDivElement | null>(null);
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
      date?: string;
      maxParticipants?: string;
    } = {};

    if (!title.trim()) {
      nextErrors.title = "제목을 적어주셔야 해요!";
    }
    if (!date) {
      nextErrors.date = "날짜가 있어야 해요!";
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
      } else if (nextErrors.date) {
        dateFieldRef.current?.querySelector("button")?.focus();
      } else if (nextErrors.maxParticipants) {
        maxParticipantsRef.current?.focus();
      }

      return;
    }

    const payload = {
      title,
      description,
      ownerUserId: 1,
      meetingType: "SINGLE_DATE",
      maxParticipants: Number(maxParticipants),
      agreedStartDate: date ? date.startOf("month").format("YYYY-MM-DD") : null,
      agreedEndDate: date ? date.endOf("month").format("YYYY-MM-DD") : null,
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
      setDate(null);
      setMaxParticipants("1");
      setErrors({});
      closeCreateMeeting();
      onCreatedAction?.();
    } catch (error) {
      console.error("Failed to create meeting.", error);
    }
  };

  return(
    <>
      <button className={"bg-blue-600 text-white px-4 py-2 rounded-md"} onClick={openCreateMeeting}>
        약속만들기
      </button>

      {/* -----------약속 만들기 모달----------- */}
      <Modal
        isOpen={isCreateMeetingOpen}
        onClose={closeCreateMeeting}
        size="sm"
        title="약속 정하기"
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
          onSubmit={createMeeting}
        >
          <Fieldset className={"flex flex-col gap-2"}>
            <Field>
              <Label className="text-sm/6 font-medium text-black">제목은 뭐로 할까요?</Label>
              <Input
                className={clsx(
                  "mt-1 block w-full rounded-lg border-2 border-green-300 bg-white/5 px-3 py-1.5 text-sm/6 text-black",
                  "data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-300",
                  errors.title && "border-none outline-2 outline-red-500"
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
              <Label className="text-sm/6 font-medium text-black">설명을 적어주세요</Label>
              <Textarea
                className={clsx(
                  "mt-1 block w-full rounded-lg border-2 border-green-300 bg-white/5 px-3 py-1.5 text-sm/6 text-black",
                  "data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-300"
                )}
                value={description}
                placeholder={"없어도 괜찮아요!"}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                ref={descriptionRef}
              />
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">날짜를 정해주세요</Label>
              <div
                ref={dateFieldRef}
                className={clsx(
                  errors.date && "[&>div>button]:border-none outline-2 outline-red-500"
                )}
              >
                <DatePicker
                  mode={"month"}
                  value={date}
                  style={clsx(
                    "mt-1 block w-full rounded-lg border-2 border-green-300 bg-white/5 px-3 py-1.5 text-sm/6 text-black text-left"
                  )}
                  onChange={(value) => {
                    setDate(value);
                    if (errors.date) {
                      setErrors((prev) => ({ ...prev, date: undefined }));
                    }
                  }}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-xs text-red-600">{errors.date}</p>
              )}
            </Field>
            <Field>
              <Label className="text-sm/6 font-medium text-black">몇 명까지 초대할까요?</Label>
              <Select
                className={clsx(
                  "mt-1 block w-full appearance-none rounded-lg border-2 border-green-300 bg-white/5 px-3 py-1.5 text-sm/6 text-black",
                  "data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
                  "*:text-black",
                  errors.maxParticipants && "border-none outline-2 outline-red-500"
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
}
