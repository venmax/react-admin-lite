
  // 设置cookie
  const setCookie = (cName: string, value: string, expireSec: number): void => {
    const today = new Date();
    const exdate = new Date(today.getTime() + expireSec * 1000);
    const cookieStr = `${cName}=${value}${expireSec ? `;expires=${exdate.toUTCString()}` : ''}`;
    document.cookie = cookieStr;
  }

  // 获取cookie
   const getCookie = (cname: string): string => {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return decodeURIComponent(c.substring(name.length, c.length));
      }
    }
    return "";
  }

  export default {
    getCookie,
    setCookie
  }