import MessageHandler from "../../Handlers/MessageHandler";
import BaseCommand from "../../lib/BaseCommand";
import WAClient from "../../lib/WAClient";
import { ISimplifiedMessage } from "../../typings";
//import axios from "axios";
import request from "../../lib/request";
import { MessageType } from "@adiwajshing/baileys";
// import { MessageType, Mimetype } from '@adiwajshing/baileys'

export default class Command extends BaseCommand {
	constructor(client: WAClient, handler: MessageHandler) {
		super(client, handler, {
			command: "nsfwyotsuba",
			description: `Will send you random 18+ Yotsuba image.`,
			aliases: ["nyotsuba"],
			category: "nsfw",
			usage: `${client.config.prefix}nsfwyotsuba `,
			baseXp: 50,
		});
	}

	run = async (M: ISimplifiedMessage): Promise<void> => {
		const images = JSON.parse((this.client.assets.get('yotsuba') as Buffer).toString()) as unknown as {
			yots: {
				id: number,
				url: string
			}[]
		}
		const Yotsuba = images.yots[Math.floor(Math.random() * images.yots.length)]
		const buffer = await request
			.buffer(Yotsuba.url)
			.catch((e) => {
				return void M.reply(e.message);
			});
		while (true) {
			try {
				M.reply(
					buffer || "Could not fetch image. Please try again later",
					MessageType.image,
					undefined,
					undefined,
					`*Yamera Kudasai......*\n`,
					undefined
				).catch((e) => {
					console.log(
						`This Error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`
					);
					// console.log('Failed')
					M.reply(
						`Could not fetch image. Here's the URL: ${Yotsuba.url}`
					);
				});
				break;
			} catch (e) {
				// console.log('Failed2')
				M.reply(
					`Could not fetch image. Here's the URL : ${Yotsuba.url}`
				);
				console.log(
					`This Error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`
				);
			}
		}
		return void null;
	};
}
