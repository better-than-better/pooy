import { get, del, postJSON, putJSON } from '@helper/fetch';

const HOST = `//${location.host}`;

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

  /**
   * fetch proxy rules
   */
  static async fetchProxyRules() {
    return await get(`${HOST}/proxy-rules.pooy`);
  }

  /**
   * save proxy rule
   */
  static async saveProxyRule(data) {
    return await postJSON(`${HOST}/proxy-rule.pooy`, { body: data });
  }

  /**
   * update proxy rule
   */
  static async updateProxyRule(data) {
    return await putJSON(`${HOST}/proxy-rule.pooy`, { body: data });
  }


  /**
   * del proxy rule
   */
  static async delProxyRule(id) {
    return await del(`${HOST}/proxy-rule.pooy`, { params: { id } });
  }

  /**
   * get global rule status
   */
  static async fetchProxyRulesStatus() {
    return await get(`${HOST}/proxy-rules-status.pooy`);
  }

  /**
   * set global rule status
   */
  static async updateGlobalRuleStatus(enabled) {
    return await putJSON(`${HOST}/proxy-rules-status.pooy`, { body: { enabled } });
  }

  /**
   * check update
   */
  static async checkUpdate() {
    return await postJSON(`${HOST}/check-update.pooy`);
  }
}

export default API;
