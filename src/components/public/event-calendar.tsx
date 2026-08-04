"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  href: string;
  startsAt: string;
  mode: string;
  beginnerFriendly: boolean;
}

export function EventCalendar({
  events,
  locale,
  labels,
}: {
  events: CalendarEvent[];
  locale: string;
  labels: { today: string };
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.startsAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map.has(day)) map.set(day, []);
        map.get(day)!.push(event);
      }
    }
    return map;
  }, [events, year, month]);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const monthLabel = firstDay.toLocaleDateString(
    locale === "ja" ? "ja-JP" : "en-US",
    { year: "numeric", month: "long" }
  );

  const weekdays =
    locale === "ja"
      ? ["日", "月", "火", "水", "木", "金", "土"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-md p-1.5 text-charcoal-600 hover:bg-ivory-100"
            aria-label="Previous month"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-charcoal-900">
            {monthLabel}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-md p-1.5 text-charcoal-600 hover:bg-ivory-100"
            aria-label="Next month"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="rounded-md border border-charcoal-300 px-3 py-1 text-sm text-charcoal-600 hover:bg-ivory-100"
        >
          {labels.today}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-charcoal-200 bg-charcoal-200">
        {weekdays.map((day) => (
          <div
            key={day}
            className="bg-ivory-50 px-2 py-2 text-center text-xs font-semibold text-charcoal-600"
          >
            {day}
          </div>
        ))}
        {cells.map((day, i) => {
          const dayEvents = day ? eventsByDay.get(day) : undefined;
          const isToday = isCurrentMonth && day === todayDate;
          return (
            <div
              key={i}
              className={`min-h-[80px] bg-white p-1 ${
                day ? "" : "bg-ivory-50"
              }`}
            >
              {day && (
                <>
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? "bg-burgundy-500 font-bold text-white"
                        : "text-charcoal-600"
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents?.map((event) => (
                    <Link
                      key={event.id}
                      href={event.href}
                      className="mt-0.5 block truncate rounded bg-burgundy-50 px-1 py-0.5 text-xs text-burgundy-700 hover:bg-burgundy-100"
                      title={event.title}
                    >
                      {event.title}
                    </Link>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
