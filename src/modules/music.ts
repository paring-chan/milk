import PatchedModule from '../PatchedModule'
import MilkClient from '../client'
import { listener } from '@pikostudio/command.ts'
import { Node } from 'erela.js'

class Music extends PatchedModule {
  constructor(private client: MilkClient) {
    super(__filename)
  }

  load() {
    super.load()
    this.client.erela.on('nodeConnect', (node) =>
      console.log(`Connected to node ${node.options.host}`),
    )
    this.client.erela.on('nodeError', (node, error) =>
      console.log(`Error on node ${node.options.host}: `, error),
    )
  }

  unload() {
    super.unload()
    this.client.erela.removeAllListeners()
  }

  @listener('ready')
  async ready() {
    this.client.erela.init(this.client.user!.id)
  }
}

export function install(client: MilkClient) {
  return new Music(client)
}
