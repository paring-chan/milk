import MilkClient from '../client'
import { command, listener } from '@pikostudio/command.ts'
import { Message, MessageEmbed } from 'discord.js'
import PatchedModule from '../PatchedModule'

class General extends PatchedModule {
  constructor(public client: MilkClient) {
    super(__filename)
  }

  @listener('ready')
  async ready() {
    console.log(`Logged in as ${this.client.user!.tag}`)
  }

  @command({ aliases: ['도움말'] })
  async help(msg: Message) {
    const groups = this.client.registry.commandManager.commands.map(
      (value, key) => ({ name: key.constructor.name, commands: value }),
    )
    const embed = new MessageEmbed()
    embed.setTitle('우유봇 도움말')
    embed.setColor('BLUE')
    for (const group of groups) {
      embed.addField(group.name, group.commands.map((x) => x.name).join(', '))
    }
    await msg.reply(embed)
  }
}

export function install(client: MilkClient) {
  return new General(client)
}
