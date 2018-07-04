const axios = require('axios');
const querystring = require('querystring');

class lookbookApi {
  constructor() {
    this.request = axios.create({
      baseURL: 'https://lookbook.nu/v2'
    });
  }

  setAccessToken(accessToken) {
    this.request.defaults.headers.common['Authorization'] = '';
    delete this.request.defaults.headers.common['Authorization'];

    this.request.defaults.headers.common[
      'Authorization'
    ] = `Token token=${accessToken}`;
  }

  async signUp(email, password, name, gender = 'girl') {
    try {
      let response = await this.request({
        method: 'POST',
        url: '/register',
        data: {
          user: {
            email: email,
            password: password,
            gender: gender,
            first_name: name
          },
          os_type: 'ios',
          device_id: '9774d56d682e549c'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'json'
      });
      this.setAccessToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }

  async login(email, password) {
    try {
      let response = await this.request({
        method: 'POST',
        url: `/login.json?user[email]=${email}&user[password]=${password}`,
        responseType: 'json'
      });
      this.setAccessToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  async getUser(userId) {
    try {
      let response = await this.request({
        method: 'GET',
        url: `/user/${userId}`,
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  async getLooks(lookType, gender = null) {
    try {
      let response = await this.request({
        method: 'GET',
        url: `/look/${lookType}/1`,
        params: {
          view: 'full',
          gender: gender
        },
        paramsSerializer: function(params) {
          return querystring.stringify(params);
        },
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  async getHotLooks(gender = null) {
    return await this.getLooks('hot', gender);
  }

  async getNewLooks(gender = null) {
    return await this.getLooks('new', gender);
  }

  async getTopLooks(gender = null) {
    return await this.getLooks('top', gender);
  }

  async getLook(lookId) {
    try {
      let response = await this.request({
        method: 'GET',
        url: `/look/${lookId}`,
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  async getItemsByLook(lookId) {
    try {
      const result = await this.getLook(lookId);
      return result.look.items;
    } catch (error) {
      console.log('error');
    }
  }

  async getLooksByCategory(category) {
    try {
      let response = await this.request({
        method: 'GET',
        url: `/streams_v2/${category}`,
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error');
    }
  }

  async searchLooks(searchTerm, sort = 'top', time = null, gender = null) {
    try {
      let response = await this.request({
        method: 'GET',
        url: '/search/looks',
        params: {
          q: searchTerm,
          sort: sort,
          time: time,
          gender: gender
        },
        paramsSerializer: function(params) {
          return querystring.stringify(params);
        },
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }

  async searchPeople(searchTerm, sort = 'top', time = null, gender = null) {
    try {
      let response = await this.request({
        method: 'GET',
        url: '/search/people',
        params: {
          q: searchTerm,
          sort: sort,
          time: time,
          gender: gender
        },
        paramsSerializer: function(params) {
          return querystring.stringify(params);
        },
        responseType: 'json'
      });
      return response;
    } catch (error) {
      console.log('error');
    }
  }
}

module.exports = lookbookApi;
