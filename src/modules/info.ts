import MilkClient from '../client'
import PatchedModule from '../PatchedModule'
import { command, optional } from '@pikostudio/command.ts'
import { Message, MessageEmbed, User } from 'discord.js'
import moment from 'moment'
import { formatDuration } from '../utils'
import { cpus } from 'os'
import * as os from 'os'

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
              moment(guild.createdAt).format(
                'YYYY년 MM월 DD일 A hh시 mm분 ss초 (Z)',
              ) +
              '(' +
              moment(guild.createdAt).fromNow() +
              ')' +
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

  @command({ name: '봇정보', aliases: ['botinfo', 'hellothisisverification'] })
  async borInfo(msg: Message) {
    const u = this.client.user!
    return msg.reply(
      new MessageEmbed()
        .setTitle(`${u.tag} 봇 정보`)
        .setColor('RANDOM')
        .setTimestamp(Date.now())
        .setFooter(
          msg.author.tag,
          msg.author.displayAvatarURL({ dynamic: true, size: 512 }),
        )
        .setThumbnail(
          u.displayAvatarURL({
            size: 4096,
          }),
        )
        .addFields([
          {
            name: '개발자',
            value: this.client.owners
              .map((x) => this.client.users.cache.get(x)?.tag)
              .filter((x) => x)
              .map((x) => '`' + x + '`')
              .join(', '),
          },
          {
            name: '봇 ID',
            value: '`' + u.id + '`',
          },
          {
            name: '봇 생일',
            value: `\`${moment(u.createdAt).format(
              'YYYY년 MM월 DD일 A hh시 mm분 ss초 (Z)',
            )}\``,
          },
          {
            name: '사용수',
            value: [
              `유저수: ${this.client.users.cache.size}`,
              `서버수: ${this.client.guilds.cache.size}`,
            ]
              .map((x) => '`' + x + '`')
              .join('\n'),
          },
          {
            name: '업타임',
            value: formatDuration(Date.now() - this.client.readyTimestamp!),
          },
          {
            name: 'CPU',
            value: Array.from(
              new Set(os.cpus().map((x) => '`' + x.model + '`')),
            ).join(', '),
          },
          {
            name: 'OS',
            value: `\`${os.type()} ${os.arch()}\``,
          },
          {
            name: '초대링크',
            value: `[\`관리자 권한으로 초대하기\`](https://discord.com/api/oauth2/authorize?client_id=${u.id}&permissions=8&scope=bot)\n[\`추천 권한으로 초대하기\`](https://discord.com/api/oauth2/authorize?client_id=${u.id}&permissions=3224696839&scope=bot)\n[\`Milk Support\`](https://discord.gg/NGKMhBeMzz)`,
          },
        ]),
    )
  }
}

export function install(client: MilkClient) {
  return new Info(client)
}
