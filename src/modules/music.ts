import PatchedModule from '../PatchedModule'
import MilkClient from '../client'
import { command, listener, rest } from '@pikostudio/command.ts'
import chalk from 'chalk'
import { Message, MessageEmbed, MessageReaction, User } from 'discord.js'

class Music extends PatchedModule {
  constructor(private client: MilkClient) {
    super(__filename)
  }

  load() {
    super.load()
    this.client.erela.on('nodeConnect', (node) =>
      console.log(
        `${chalk.red('[INFO:LAVALINK]')} Connected to node ${
          node.options.host
        }`,
      ),
    )
    this.client.erela.on('nodeError', (node, error) =>
      console.log(
        `${chalk.red('[ERROR:LAVALINK]')} Error on node ${node.options.host}: `,
        error,
      ),
    )
  }

  unload() {
    super.unload()
    this.client.erela.removeAllListeners()
  }

  @command({ name: '재생', aliases: ['play'] })
  async play(msg: Message, @rest url: string) {
    if (!msg.member?.voice.channelID)
      return msg.reply('음성 채널에 들어가주세요')
    const player =
      this.client.erela.players.get(msg.guild!.id) ??
      this.client.erela.create({
        selfDeafen: true,
        guild: msg.guild!.id,
        textChannel: msg.channel.id,
        voiceChannel: msg.member.voice.channelID,
      })
    if (player.voiceChannel !== msg.member.voice.channelID)
      return msg.reply('음악을 재생중인 음성채널에 들어가주세요!')
    const res = await this.client.erela.search(url, msg.author)
    if (res.loadType === 'NO_MATCHES') {
      return msg.reply('검색 결과가 없습니다')
    } else if (res.loadType === 'LOAD_FAILED') {
      return msg.reply(`불러오기 실패: ${res.exception?.message}`)
    } else if (
      res.loadType === 'PLAYLIST_LOADED' ||
      res.loadType === 'TRACK_LOADED' ||
      res.loadType === 'SEARCH_RESULT'
    ) {
      player.queue.add(res.tracks[0])
      player.connect()
      if (!player.playing) await player.play()
      return msg.reply(`${res.tracks.length}곡을 대기열에 추가했어요!`)
    }
  }

  @listener('ready')
  async ready() {
    this.client.erela.init(this.client.user!.id)
  }

  @listener('raw')
  raw(payload: any) {
    this.client.erela.updateVoiceState(payload)
  }
}

export function install(client: MilkClient) {
  return new Music(client)
}
