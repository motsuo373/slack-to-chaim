import { NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

export async function GET() {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.error("SLACK_BOT_TOKENが設定されていません");
    return NextResponse.json({ error: "サーバー設定エラー" }, { status: 500 });
  }

  try {
    const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
    const result = await slackClient.users.list({});

    if (!result.ok) {
      throw new Error("Slackユーザーリストの取得に失敗しました");
    }

    const userList = result.members
      ?.filter(
        (user) =>
          !user.is_bot &&
          !user.deleted &&
          !user.is_workflow_bot &&
          !user.is_restricted &&
          !user.is_ultra_restricted
      )
      .map((user) => ({
        id: user.id,
        name: user.name,
        profile: user.profile,
        display_name: user.profile?.display_name,
        display_name_normalized: user.profile?.display_name_normalized,
      }));

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error("Slackユーザーリストの取得に失敗しました:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
