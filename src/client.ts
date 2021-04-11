import * as Discord from 'discord.js'
import { CommandClient } from '@pikostudio/command.ts'
// @ts-ignore
import config from '../config.json'
import Dokdo from 'dokdo'
import path from 'path'
import * as fs from 'fs'
import { Manager } from 'erela.js'

export default class MilkClient extends CommandClient {
  config = config
  erela = new Manager({
    send: (id, payload) => {
      const guild = this.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
    nodes: config.lavalink.nodes,
  })

  constructor() {
    super(
      {
        partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'],
        intents: Discord.Intents.ALL,
      },
      {
        owners: 'auto',
        prefix: config.prefix,
      },
    )
    fs.readdirSync(path.join(__dirname, 'modules')).forEach((x) =>
      this.registry.loadModule(path.join(__dirname, 'modules/' + x)),
    )
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
