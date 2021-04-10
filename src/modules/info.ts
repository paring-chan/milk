import MilkClient from '../client'
import PatchedModule from '../PatchedModule'
import { command, optional } from '@pikostudio/command.ts'
import { Message, MessageEmbed, User } from 'discord.js'
import moment from 'moment'

enum Status {
  online = '온라인 [🟢]',
  dnd = '다른 용무 중 [⛔]',
  idle = '자리 비움 [🌙]',
  offline = '오프라인 [🔘]',
}

enum Client {
  mobile = '`모바일` <:mobile:817673574658998332>',
  web = '`웹` 🌏',
  desktop = '`컴퓨터` 🖥️',
}

class Info extends PatchedModule {
  constructor(public client: MilkClient) {
    super(__filename)
  }

  @command({ name: '프로필' })
  async profileImage(msg: Message, @optional user: User = msg.author) {
    return msg.reply(
      new MessageEmbed({
        color: 'RANDOM',
        title: `${user.tag}님의 프로필`,
      }).setImage(user.displayAvatarURL({ size: 4096, dynamic: true })),
    )
  }

  @command({ name: '유저정보', aliases: ['userinfo'] })
  async userInfo(msg: Message, @optional user: User = msg.author) {
    return msg.reply(
      new MessageEmbed()
        .setTitle(`${user.tag}님의 정보`)
        .setThumbnail(
          msg.author.displayAvatarURL({ size: 4096, dynamic: true }),
        )
        .addFields([
          {
            name: 'ID',
            value: '`' + user.id + '`',
          },
          {
            name: '태그',
            value: '`' + user.tag + '`',
          },
          {
            name: '상태',
            value:
              '`' +
              Status[
                user.presence.status === 'invisible'
                  ? 'offline'
                  : user.presence.status
              ] +
              '`',
          },
          {
            name: '접속 클라이언트',
            value: user.presence.clientStatus
              ? Object.keys(user.presence.clientStatus)
                  .map((k) => Client[k as 'mobile' | 'web' | 'desktop'])
                  .join('\n')
              : '`없음`',
          },
          {
            name: '계정 생성일',
            value: moment(user.createdAt).format(
              'YYYY/MM/DD A hh : mm : ss (Z)',
            ),
          },
        ]),
    )
  }
}

export function install(client: MilkClient) {
  return new Info(client)
}
