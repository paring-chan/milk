import MilkClient from '../client'
import { command, listener } from '@pikostudio/command.ts'
import { Message, MessageEmbed } from 'discord.js'
import PatchedModule from '../PatchedModule'
import * as os from 'os'
import moment from 'moment'
import { formatDuration } from '../utils'

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
    embed.setColor('RANDOM')
    for (const group of groups) {
      embed.addField(group.name, group.commands.map((x) => x.name).join(', '))
    }
    await msg.reply(embed)
  }
  @command({ name: '핑', aliases: ['ping'] })
  async ping(msg: Message) {
    const m = await msg.reply(
      new MessageEmbed({
        title: '메시지 지연 시간 계산중입니다. 잠시만 기다려주세요....',
      }),
    )
    const messagePing = Date.now() - m.createdTimestamp
    await m.edit(
      new MessageEmbed({
        title: '🏓 | 풍!',
        description: `디스코드 API 핑: ${this.client.ws.ping}ms
메시지 지연 시간: ${messagePing}ms`,
      }),
    )
  }

  @command({ name: '업타임', aliases: ['uptime'] })
  async uptime(msg: Message) {
    const processUptime = formatDuration(process.uptime() * 1000)
    const serverUptime = formatDuration(os.uptime() * 1000)
    const botUptime = formatDuration(Date.now() - this.client.readyTimestamp!)
    await msg.reply(
      new MessageEmbed({
        title: '업타임',
        description: `프로세스 업타임: ${processUptime}\n서버 업타임: ${serverUptime}\n봇 업타임: ${botUptime}`,
      }),
    )
  }
}

export function install(client: MilkClient) {
  return new General(client)
}
