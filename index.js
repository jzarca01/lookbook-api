const axios = require('axios');
const qs = require('qs');
const FormData = require('form-data');
const fs = require('fs');

const MAX_RESULTS_PER_PAGE = 10

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
      console.log('error with signUp', error);
    }
  }

  async login(email, password) {
    try {
      let response = await this.request({
        method: 'POST',
        url: `/login.json?user[email]=${email}&user[password]=${password}`,
        params: {
          user: {
            email: email,
            password: password
          }
        },
        paramsSerializer: function (params) {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        },
        responseType: 'json'
      });
      this.setAccessToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.log('error with login', error);
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
      console.log('error with getUser'), error;
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
        paramsSerializer: function (params) {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        },
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error with getLooks', error);
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
      console.log('error with getLook', error);
    }
  }

  async getItemsByLook(lookId) {
    try {
      const result = await this.getLook(lookId);
      return result.look.items;
    } catch (error) {
      console.log('error with getItemsByLook', error);
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
      console.log('error with getLooksByCategory', error);
    }
  }

  async getResultsNumber(search = "looks", searchTerm, sort = 'top', time = null, gender = null) {
    try {
      const results = await this.getResults(search, searchTerm, sort, time, gender)
      return results.total
    } catch (error) {
      console.log('error with getResultsNumber', error);
    }
  }

  async getResults(search = "looks", searchTerm, sort = 'top', time = null, gender = null, page = "1") {
    try {
      let response = await this.request({
        method: 'GET',
        url: `/search/${search}`,
        params: {
          q: searchTerm,
          sort: sort,
          time: time,
          gender: gender,
          page: page
        },
        paramsSerializer: function (params) {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        },
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error with getResults', error);
    }
  }

  async searchLooks(searchTerm, sort = 'top', time = null, gender = null, maxResults = "50") {
    try {
      const resultsNumber = await this.getResultsNumber('looks', searchTerm, sort, time, gender)
      let totalFetchedResults = 0
      const numberOfPages = (resultsNumber % 10) + 1
      if(resultsNumber <= MAX_RESULTS_PER_PAGE) {
        return {term: searchTerm, ...await this.getResults("looks", searchTerm, sort, time, gender)}
      }
      else {
        let looks = []

        for(let currentPage = 1; (currentPage < numberOfPages) || (totalFetchedResults < maxResults); currentPage++) {
          let moreLooks = await this.getResults("looks", searchTerm, sort, time, gender, currentPage)
          totalFetchedResults += MAX_RESULTS_PER_PAGE
          looks.push(moreLooks.looks)
        }
        return {
          term: searchTerm,
          total: resultsNumber,
          looks: looks.reduce((acc, el) => [...acc, ...el] , [])
        }
      }
    } catch (error) {
      console.log('error with searchLooks', error);
    }
  }

  async searchPeople(searchTerm, sort = 'top', time = null, gender = null, maxResults = "50") {
    try {
      const resultsNumber = await this.getResultsNumber('users', searchTerm, sort, time, gender)
      let totalFetchedResults = 0
      const numberOfPages = (resultsNumber % 10) + 1
      if(resultsNumber <= MAX_RESULTS_PER_PAGE) {
        return {term: searchTerm, ...await this.getResults("users", searchTerm, sort, time, gender)}
      }
      else {
        let users = []

        for(let currentPage = 1; (currentPage < numberOfPages) || (totalFetchedResults < maxResults); currentPage++) {
          let morePeople = await this.getResults("users", searchTerm, sort, time, gender, currentPage)
          totalFetchedResults += MAX_RESULTS_PER_PAGE
          users.push(morePeople.users)
        }
        return {
          term: searchTerm,
          total: resultsNumber,
          users: users.reduce((acc, el) => [...acc, ...el] , [])
        }
      }
    } catch (error) {
      console.log('error with searchPeople', error);
    }
  }

  async hypeLook(lookId) {
    try {
      let response = await this.request({
        method: 'POST',
        url: `/look/${lookId}/hype`
      });
      return response;
    } catch (error) {
      console.log('error with hypeLook', error);
    }
  }

  async fanUser(userId) {
    try {
      let response = await this.request({
        method: 'POST',
        url: `/user/${userId}/fan`
      });
      return response;
    } catch (error) {
      console.log('error with fanUser', error);
    }
  }

  async unfanUser(userId) {
    try {
      let response = await this.request({
        method: 'DELETE',
        url: `/user/${userId}/fan`
      });
      return response;
    } catch (error) {
      console.log('error with unfanUser', error);
    }
  }

  async addComment(modelId, comment) {
    try {
      let response = await this.request({
        method: 'POST',
        url: '/comment/create',
        params: {
          comment: {
            type: 'LookComment',
            model_id: modelId,
            body: comment
          }
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        paramsSerializer: function (params) {
          return qs.stringify(params, {
            arrayFormat: 'brackets'
          })
        },
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error with addComment', error);
    }
  }

  async postLook(userId, {
    title,
    description,
    photo,
    tumblr = 'NO',
    facebook = 'NO',
    twitter = 'NO'
  }) {
    try {
      let formData = new FormData()
      formData.append('photo', fs.createReadStream(__dirname + `/uploads/${photo}`))
      formData.append('title', title)
      formData.append('user_id', userId)
      //formData.append('colors', [])
      //formData.append('items_tags', [])
      formData.append('description', description)
      formData.append('post_to_tumblr', tumblr)
      formData.append('post_to_facebook', facebook)
      formData.append('post_to_twitter', twitter)

      let response = await this.request({
        method: 'POST',
        url: '/look/create',
        data: formData,
        headers: formData.getHeaders(),
        responseType: 'json'
      });
      return response.data;
    } catch (error) {
      console.log('error with postLook', error);
    }
  }
}

module.exports = lookbookApi;