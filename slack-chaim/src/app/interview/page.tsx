"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { type CarouselApi } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// 新しい型定義を追加
type SlackUser = {
  id: string;
  name: string;
  profile: {
    display_name?: string;
    display_name_normalized?: string;
    [key: string]: unknown; // profileには他のプロパティも含まれる可能性があるため
  };
  display_name?: string;
  display_name_normalized?: string;
};

export default function Interview() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const [carouselCount, setCarouselCount] = useState(0);
  const [userList, setUserList] = useState<SlackUser[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<SlackUser[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [value, setValue] = useState("");
  const [visiter, setVisiter] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/slack-users");
      const data = await response.json();

      if (data.users) {
        setUserList(data.users);
      } else {
        console.error("ユーザーリストの取得に失敗しました");
      }
    } catch (error) {
      console.error("APIの呼び出しに失敗しました:", error);
    }
  }, []);

  console.log(userList);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    setCarouselCount(carouselApi.scrollSnapList().length);
    setCarouselCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCarouselCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  const handleInputChange = useCallback(
    (inputValue: string) => {
      const filtered = userList.filter(
        (user) =>
          user.name.includes(inputValue) ||
          (user.display_name && user.display_name.includes(inputValue))
      );
      setFilteredPeople(filtered);
    },
    [userList]
  );

  const handleCarouselNext = () => {
    if (visiter === "" && carouselCurrent === 1) {
      return;
    }
    carouselApi?.scrollNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="space-y-6 w-full max-w-2xl">
        <h1 className="text-center text-3xl font-bold">面接予定の方はこちら</h1>

        <Carousel setApi={setCarouselApi} className="w-full p-4">
          <CarouselContent>
            <CarouselItem>
              <div className="grid w-full gap-1.5">
                <Label>あなたの名前を入力してください</Label>
                <Input
                  placeholder="管理 太郎"
                  value={visiter}
                  onChange={(e) => setVisiter(e.target.value)}
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-[300px] justify-between"
                  >
                    {value || "人を選択してください..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="名前を検索..."
                      onValueChange={handleInputChange}
                    />
                    <CommandEmpty>該当する人が見つかりません。</CommandEmpty>
                    <CommandGroup>
                      {filteredPeople.map((people) => (
                        <CommandItem
                          key={people.id}
                          value={people.display_name || people.name}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === (people.display_name || people.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {people.display_name || people.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </CarouselItem>
            <CarouselItem>3</CarouselItem>
          </CarouselContent>
          {/* CarouselNextを削除し、独自の次へボタンを追加 */}
          <div className="flex justify-center gap-4 items-center mt-6">
            <Button onClick={() => carouselApi?.scrollPrev()} className="">
              前へ
            </Button>
            <Button
              onClick={handleCarouselNext}
              className=""
              disabled={visiter === "" && carouselCurrent === 1}
            >
              次へ
            </Button>
          </div>
        </Carousel>

        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {carouselCurrent} of {carouselCount}
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/" className="text-blue-600 hover:underline">
            最初のページへ戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}
