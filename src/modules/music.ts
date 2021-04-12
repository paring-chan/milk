import PatchedModule from '../PatchedModule'
import MilkClient from '../client'
import { listener } from '@pikostudio/command.ts'

class Music extends PatchedModule {
  constructor(private client: MilkClient) {
    super(__filename)
  }

  @listener('ready')
  async ready() {
    this.client.erela.init(this.client.user!.id)
  }
}

export function install(client: MilkClient) {
  return new Music(client)
}
