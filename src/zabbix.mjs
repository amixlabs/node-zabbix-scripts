import axios from 'axios'

export class Zabbix {
  #url
  #timeout
  #auth
  constructor({ url, timeout = 30000 }) {
    this.#url = url
    this.#timeout = timeout
  }
  async #fetch(data) {
    const response = await axios({
      baseURL: this.#url,
      timeout: this.#timeout,
      headers: { 'Content-Type': 'application/json-rpc' },
      method: 'POST',
      data
    })
    const rdata = response.data
    if (rdata.error) {
      throw new Error(rdata.error.data)
    }
    return rdata.result
  }
  async login({ user, pass }) {
    this.#auth = await this.#fetch({
      jsonrpc: '2.0',
      method: 'user.login',
      params: { username: user, password: pass },
      id: 1
    })
  }
  async eventGet(params) {
    return await this.#fetch({
      jsonrpc: '2.0',
      method: 'event.get',
      params,
      id: 1,
      auth: this.#auth
    })
  }
  async problemGet(params) {
    return await this.#fetch({
      jsonrpc: '2.0',
      method: 'problem.get',
      params,
      id: 1,
      auth: this.#auth
    })
  }
  async triggerGet(params) {
    return await this.#fetch({
      jsonrpc: '2.0',
      method: 'trigger.get',
      params,
      id: 1,
      auth: this.#auth
    })
  }
  async logout() {
    return await this.#fetch({
      jsonrpc: '2.0',
      method: 'user.logout',
      params: [],
      id: 1,
      auth: this.#auth
    })
  }
}
