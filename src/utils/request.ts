import Axios from 'axios';
import utils from '@utils/requestUtils';
import { message } from 'antd';

const domain = '/';
const COOKIE_SESSION_ID = 'adminSessionId';

let tokenInterceptor: number;

export const injectTokenInceptor = () => {
  setHeaders();
};

const service = Axios.create({
  baseURL: domain, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
});

// 全局 loading 根据后面需求添加
service.interceptors.request.use(
  (config) => {
    /*if (store.getters.token) {
        config.headers["Authorization"] = getToken();
    }*/
    config.headers['content-type'] = 'application/json;charset=UTF-8';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const setHeaders = () => {
  const userSessionIdClaim = utils.getCookie(COOKIE_SESSION_ID);
  const userIdMatch = userSessionIdClaim.match(
    /(?<=session:)(\d*)(?=:.*)?/g,
  );
  if (!userSessionIdClaim || !userIdMatch) {
    return;
  }
  tokenInterceptor = service.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

const clearHeaders = () => {
  utils.setCookie(COOKIE_SESSION_ID, '', -1);
  service.interceptors.request.eject(tokenInterceptor);
};

const notify = (messages: string | number) => {
  message.error({
    content: messages || '请求失败',
  });
};
/**
 * 返回interceptor
 * 当调用登录接口时设置登录状态，登出时清除状态，其他：
 * 仅200时返回正确信息，其他情况清除登录状态（修改成重试？）
 *  */
service.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      const result: any = response.data;
      console.log(
        '\n',
        `--- Api '${response.config.url}' ---`,
        '\n[params]',
        response.config.params,
        '\n[result]',
        result,
        '\n\n',
      );

      // 成功返回
      switch (result.code) {
        case 1: {
          if (
            /^\/user\/login$/.test(
              response.config.url as string,
            )
          ) {
            // const userSessionId =
            //   'session:' + result.data.userId + ':' + uuidv4(); // uid目前写死
            const userSessionId = result.data.userIdCacheKey;
            utils.setCookie(
              COOKIE_SESSION_ID,
              userSessionId,
              2 * 60 * 60,
            );
            setHeaders();
          }

          if (response.config.url == '/user/logout') {
            clearHeaders();
          }
          return Promise.resolve(result);
        }
        case -1:
        case -2:
        case -3: {
          clearHeaders();
          if (!/^\/user\/(login|baseInfo)$/.test(response.config.url as string,)) {
            window.location.reload();
          }
          return Promise.reject(result);
        }
        default:
          console.log('result', result);
          return Promise.reject(result);
      }
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          break;
        case 404:
          break;
        case 500:
          break;
        default:
          console.error('网络请求异常：', error);
          break;
      }
    }
    return Promise.reject(error);
  },
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} uid [请求时loading]
 */
export function get(url: string, data = {}, silent?: boolean, config?: any) {
  return new Promise((resolve, reject) => {
    service
      .get(url, { params: data, ...config })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (!silent) {
          notify(err ? err.message : '请求失败，请重试');
        }
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} uid [请求时uid]
 */
export function post(url: string, data: any, silent?: boolean, config?: any) {
  const params = data;
  return new Promise((resolve, reject) => {
    service
    // .post(`${url}?cid=${newData.cid}&q=${newData.q}&sign=${newData.sign}&uid=${newData.uid}`)
    // .post(url, newData)
      .post(url, params, config)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (!silent) {
          notify(err ? err.message : '请求失败，请重试');
        }
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */
export function put(url: string, data: any, silent?: boolean) {
  return new Promise((resolve, reject) => {
    service
      .put(url, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (!silent) {
          notify(err ? err.err : '请求失败，请重试');
        }
        reject(err.response ? err.response.data : err);
      });
  });
}

/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 * @param {Object} loading [请求时loading]
 */

export function del(url: string, data: any, silent?: boolean) {
  return new Promise((resolve, reject) => {
    service
      .delete(url, {
        data: data,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (!silent) {
          notify(err ? err.err : '请求失败，请重试');
        }
        reject(err.response ? err.response.data : err);
      });
  });
}

function isObj(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
