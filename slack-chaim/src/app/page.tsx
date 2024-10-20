"use client";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Home() {
  const handleOtherClick = () => {
    // ここにその他のご用件の方向けの処理を追加
    console.log("その他のご用件の方がチャイムを鳴らしました");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-10 w-full px-10">
        <h1 className="text-6xl font-bold">ようこそ、Canlyへ。</h1>
        <div className="grid grid-cols-2 gap-10">
          <Button
            // onClick={handleInterviewClick}
            className="w-full h-40 text-2xl"
            asChild
          >
            <Link href="/interview">面接予定の方はこちら</Link>
          </Button>
          <Button
            onClick={handleOtherClick}
            variant="outline"
            className="w-full h-40 text-2xl"
          >
            その他ご用件の方はこちら
          </Button>
        </div>
      </div>
    </div>
  );
}
