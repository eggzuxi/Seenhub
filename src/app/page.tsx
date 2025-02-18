"use client"

import MovingImages from "@/components/common/MovingImages";

export default function Home() {
  return (
    <div className="relative min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-hidden">
      <MovingImages />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start relative z-10">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
        </div>
      </main>
    </div>
  );
}
