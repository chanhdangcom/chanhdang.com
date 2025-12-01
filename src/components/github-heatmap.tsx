"use client";

import { useTheme } from "next-themes";
import useSWR from "swr";

type ContributionDay = {
  date: string;
  contributionCount: number;
};

type ApiResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: { contributionDays: ContributionDay[] }[];
      };
    };
  };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const COLORS_DARK = [
  "bg-zinc-900", // level 0 – no contributions
  "bg-zinc-800", // level 1
  "bg-zinc-700", // level 2
  "bg-zinc-500", // level 3
  "bg-zinc-300", // level 4 – max
];

const COLORS_LIGHT = [
  "bg-zinc-100", // level 0 – no contributions
  "bg-zinc-200", // level 1
  "bg-zinc-300", // level 2
  "bg-zinc-400", // level 3
  "bg-zinc-600", // level 4 – max
];

// Skeleton dùng cùng tỉ lệ với dữ liệu thật (GitHub calendar ~53 tuần, 7 ngày)
const LOADING_WEEKS = 53;
const LOADING_DAYS = 7;

export function GitHubHeatmap() {
  const { resolvedTheme } = useTheme();

  const { data, isLoading, error } = useSWR<ApiResponse>(
    "/api/github-contributions",
    fetcher
  );

  const COLORS = resolvedTheme === "light" ? COLORS_LIGHT : COLORS_DARK;

  // Loading skeleton: lưới màu nhấp nháy random
  if (isLoading) {
    const monthNamesSkeleton = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Phân bố month label gần giống GitHub cho skeleton
    const skeletonMonthLabels = Array.from({ length: LOADING_WEEKS }).map(
      (_, index) => {
        const monthIndex = Math.floor((index / LOADING_WEEKS) * 12);
        const label = monthNamesSkeleton[monthIndex] ?? "";
        // Chỉ gắn label khi bắt đầu mỗi tháng để tránh lặp lại liên tục
        if (index === 0) return label;
        const prevMonthIndex = Math.floor(((index - 1) / LOADING_WEEKS) * 12);
        return monthIndex !== prevMonthIndex ? label : "";
      }
    );

    return (
      <div className="p-4 font-mono text-[10px]">
        {/* Month labels skeleton */}
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <div className="mr-2 w-8" />

            <div className="mb-1 flex gap-[3px]">
              {skeletonMonthLabels.map((label, i) => (
                <div key={i} className="h-4 w-3 text-center">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekday labels + random grid */}
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <div className="mr-2 flex w-8 flex-col justify-between py-[2px] text-[10px] text-zinc-500">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            <div className="flex justify-center gap-[3px]">
              {Array.from({ length: LOADING_WEEKS }).map((_, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {Array.from({ length: LOADING_DAYS }).map((_, dayIdx) => {
                    const level = Math.floor(
                      Math.random() * COLORS_DARK.length
                    );
                    const color =
                      resolvedTheme === "light"
                        ? COLORS_LIGHT[level]
                        : COLORS_DARK[level];

                    return (
                      <div
                        key={dayIdx}
                        className={`h-4 w-4 ${color} animate-pulse rounded-sm`}
                        style={{ animationDuration: "2.8s" }}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="mx-12 mt-3 flex items-center justify-between">
          <p className="text-xs">Weeks: {LOADING_WEEKS}</p>

          <div className="flex items-center gap-2">
            <span className="text-xs">Less</span>

            {COLORS.map((color, idx) => (
              <div
                key={idx}
                className={`h-4 w-4 ${color} animate-pulse`}
                style={{ animationDuration: "2.8s" }}
              />
            ))}
            <span className="text-xs">More</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-40 items-center justify-center font-mono text-sm">
        Không tải được dữ liệu GitHub.
      </div>
    );
  }

  const calendar = data.user.contributionsCollection.contributionCalendar;
  const weeks = calendar.weeks;

  // Flatten contributionDays
  const days = weeks.flatMap((w) => w.contributionDays);

  // Find max value
  const max = Math.max(...days.map((d) => d.contributionCount));

  // map count → color level
  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count < max * 0.25) return 1;
    if (count < max * 0.5) return 2;
    if (count < max * 0.75) return 3;
    return 4;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Tạo label tháng giống GitHub: ưu tiên các ngày đầu tháng (1–7)
  const monthLabels = weeks.map((week, index) => {
    const firstWeekDay =
      week.contributionDays.find((d) => {
        const dayDate = new Date(d.date);
        return dayDate.getDate() <= 7;
      }) ?? week.contributionDays[0];

    if (!firstWeekDay) return "";

    const date = new Date(firstWeekDay.date);
    const prevWeek = weeks[index - 1];

    if (!prevWeek) {
      return monthNames[date.getMonth()];
    }

    const prevFirstDay =
      prevWeek.contributionDays.find((d) => {
        const dayDate = new Date(d.date);
        return dayDate.getDate() <= 7;
      }) ?? prevWeek.contributionDays[0];

    if (!prevFirstDay) {
      return monthNames[date.getMonth()];
    }

    const prevDate = new Date(prevFirstDay.date);

    if (prevDate.getMonth() !== date.getMonth() && date.getDate() <= 7) {
      return monthNames[date.getMonth()];
    }

    return "";
  });

  return (
    <div className="p-4 font-mono text-[10px]">
      {/* Month labels – canh thẳng với lưới bên dưới */}
      <div className="overflow-x-auto">
        <div className="flex justify-center">
          {/* placeholder có cùng width với cột thứ trong tuần */}
          <div className="mr-2 w-8" />

          <div className="mb-1 flex gap-[3px]">
            {monthLabels.map((label, i) => (
              <div key={i} className="h-4 w-3 text-center">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex justify-center">
          <div className="mr-2 flex w-8 flex-col justify-between py-[2px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="flex justify-center gap-[3px]">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {week.contributionDays.map((day, j) => {
                  const level = getLevel(day.contributionCount);
                  const isActive = day.contributionCount > 0;

                  return (
                    <div
                      key={j}
                      className={`h-4 w-4 ${COLORS[level]} rounded-sm transition hover:brightness-125 ${
                        isActive ? "animate-pulse" : ""
                      }`}
                      style={
                        isActive ? { animationDuration: "2.8s" } : undefined
                      }
                      title={`${day.contributionCount} contributions on ${new Date(
                        day.date
                      ).toLocaleDateString()}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-12 mt-3 flex items-center justify-between">
        <p className="text-xs">Weeks: {weeks.length}</p>

        <div className="flex items-center gap-2">
          <span className="text-xs">Less</span>

          {COLORS.map((color, idx) => (
            <div key={idx} className={`h-4 w-4 ${color}`} />
          ))}
          <span className="text-xs">More</span>
        </div>
      </div>
    </div>
  );
}
