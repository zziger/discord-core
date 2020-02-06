import chalk from "chalk";
import request from "request";
import {DiscordAPI} from "./API/platforms/discord/DiscordAPI";
import token from "./token";

export namespace Core {
  export async function start(): Promise<void> {
    console.log(chalk`{yellow Starting...}`);
    process.stdin.resume();
    await Core.discord.connect();
  }

  export let discord = new DiscordAPI(token, 2);
}

// @ts-ignore
global.Core = Core;
// @ts-ignore
global.request = request;
