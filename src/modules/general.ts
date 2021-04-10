import MilkClient from "../client";
import {command, listener} from "@pikostudio/command.ts";
import {Message} from "discord.js";
import PatchedModule from "../PatchedModule";

class General extends PatchedModule {
    constructor(public client: MilkClient) {
        super(__filename)
    }

    @listener('ready')
    async ready() {
        console.log(`Logged in as ${this.client.user!.tag}`)
    }

    @command({aliases: ['도움말']})
    async help(msg: Message) {
        const modules = this.client.registry.commandManager.commands.map((value, key) => ({group: key.constructor.name, commands: value}))
        console.log(modules)
    }
}

export function install(client: MilkClient) {
    return new General(client)
}