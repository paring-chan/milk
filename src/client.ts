import * as Discord from 'discord.js'
import {CommandClient} from "@pikostudio/command.ts";
// @ts-ignore
import config from '../config.json'
import Dokdo from "dokdo";
import path from "path";

export default class MilkClient extends CommandClient {
    config = config

    constructor() {
        super({
        }, {
            owners: 'auto',
            prefix: config.prefix,
        });
        ['general', 'dev'].forEach((x) => this.registry.loadModule(path.join(__dirname, 'modules/' + x)))
        this.login(config.token).then(() => {
            const dokdo = new Dokdo(this, {
                noPerm(msg: Discord.Message): any {
                    msg.react('🚫')
                },
                owners: this.owners,
                prefix: this.config.prefix,
            })
            this.on('message', dokdo.run.bind(dokdo))
        })
    }
}