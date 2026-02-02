"use client";

import { useEffect, useState } from "react";

type Meeting = {
  meetingId?: number | string;
  id?: number | string;
  title?: string;
  createdAt?: string;
};

type MeetingListProps = {
  refreshKey: number;
};

const SkeletonRow = () => (
  <li className="rounded-md border-2 border-green-200 bg-white/60 px-3 py-2">
    <div className="h-4 w-2/3 rounded bg-green-200/70" />
    <div className="mt-2 h-3 w-1/3 rounded bg-green-200/50" />
  </li>
);

const MeetingList = ({ refreshKey }: MeetingListProps) => {
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadMeetings = async () => {
      if (meetings === null) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setHasError(false);

      try {
        const response = await fetch("/api/meetings", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = response.ok ? await response.json() : [];
        setMeetings(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setHasError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    loadMeetings();

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  if (isLoading) {
    return (
      <ul className="flex flex-col gap-2 animate-pulse" aria-busy="true">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </ul>
    );
  }

  if (hasError) {
    return <div>목록을 불러오지 못했어요.</div>;
  }

  return (
    <div className="space-y-3">
      {isRefreshing && (
        <div className="text-xs text-gray-500">새 목록 불러오는 중...</div>
      )}
      {Array.isArray(meetings) && meetings.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {meetings.map((meeting) => (
            <li
              key={meeting.meetingId ?? meeting.id ?? `${meeting.title}-${meeting.createdAt ?? ""}`}
              className="rounded-md border-2 border-green-500 px-3 py-2"
            >
              <div className="text-sm font-medium text-gray-900">
                {meeting.title ?? "제목이 없어요"}
              </div>
              <div className="text-xs text-gray-600">
                {meeting.createdAt ?? "날짜가 없어요"}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>내용</div>
      )}
    </div>
  );
};

export default MeetingList;
