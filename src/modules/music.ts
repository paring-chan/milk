import PatchedModule from '../PatchedModule'
import MilkClient from '../client'
import { command, listener, rest } from '@pikostudio/command.ts'
import { Node } from 'erela.js'
import chalk from 'chalk'
import { Message } from 'discord.js'

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
  async play(msg: Message, @rest url: string) {}

  @listener('ready')
  async ready() {
    this.client.erela.init(this.client.user!.id)
  }
}

export function install(client: MilkClient) {
  return new Music(client)
}
