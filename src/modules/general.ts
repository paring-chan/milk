import MilkClient from "../client";
import {listener, Module} from "@pikostudio/command.ts-v2";

class General extends Module {
    constructor(public client: MilkClient) {
        super(__filename)
    }

    @listener('ready')
    async ready() {
        console.log(`Logged in as ${this.client.user!.tag}`)
    }
}

export function install(client: MilkClient) {
    return new General(client)
}