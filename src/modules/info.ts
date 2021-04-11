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
                  .join(', ')
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

  @command({ name: '서버정보', aliases: ['serverinfo'] })
  async serverInfo(msg: Message) {
    if (!msg.guild) return msg.reply('서버에서만 사용 가능합니다.')
    const guild = msg.guild
    await msg.reply(
      new MessageEmbed({
        color: 'RANDOM',
      })
        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })!)
        .setTitle(`서버 ${guild.name}의 정보`)
        .addFields([
          {
            name: '서버 소유자',
            value: '`' + guild.owner!.user.tag + '`',
          },
          {
            name: '서버 ID',
            value: '`' + guild.id + '`',
          },
          {
            name: '유저 수',
            value:
              '`전체: ' +
              guild.memberCount +
              '`\n`유저: ' +
              guild.members.cache.filter((x) => !x.user.bot).size +
              '`\n`봇: ' +
              guild.members.cache.filter((x) => x.user.bot).size +
              '`',
          },
          {
            name: '서버 지역',
            value: guild.region,
          },
          {
            name: '서버 생성일',
            value:
              '`' +
              moment(msg.guild?.createdAt).format(
                'YYYY년 MM월 DD일 A hh시 mm분 ss초 (Z)',
              ) +
              '`',
          },
        ]),
    )
    if (guild.splash)
      await msg.channel.send(
        new MessageEmbed({
          title: `서버 ${guild.name}의 초대 배경`,
        })
          .setColor('RANDOM')
          .setImage(
            guild.splashURL({
              size: 4096,
            })!,
          ),
      )
    if (guild.banner)
      await msg.channel.send(
        new MessageEmbed({
          title: `서버 ${guild.name}의 배너`,
        })
          .setColor('RANDOM')
          .setImage(
            guild.bannerURL({
              size: 4096,
            })!,
          ),
      )
  }
}

export function install(client: MilkClient) {
  return new Info(client)
}
