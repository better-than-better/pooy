import { get } from '@helper/fetch';

const HOST = '//127.0.0.1:9000';

class API {
  /**
   * fetch some data
   */
  static async fetchResponse(id) {
    const params = { id };

    return await get(`${HOST}/response.pooy`, { params }, false);
  }

  /**
   * fetch ca
   */
  static async fetchRootCA() {
    return await get(`${HOST}/ca.pooy`);
  }

  /**
   * fetch proxy status
   */
  static async fetchProxyStatus() {
    return await get(`${HOST}/proxy-status.pooy`);
  }
}

export default API;
