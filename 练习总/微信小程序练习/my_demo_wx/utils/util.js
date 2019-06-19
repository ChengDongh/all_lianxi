const app = getApp();

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}${url}`,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'x-token': 'x-token'  // 看自己是否需要
      },
      success(request) {
        if (request.data.code === 2000) {
          resolve(request.data)
        } else {
          reject(request.data)
        }
      },
      fail(error) {
        reject(error.data)
      }
    })
  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}

// api.post(login, {
//   data: ''
// }).then(res => {
//   if () { }
// }).catch(err => {
//   wx.showToast({
//     title: err.message,
//     icon: 'none'
//   })
// })


function formatTime(date){
  var date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime_one(date) {
  var date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function isphone(mobile) {
  return /^1(3|4|5|7|8)\d{9}$/.test(mobile)
}

module.exports = {
  formatTime: formatTime,
  isphone: isphone,
  formatTime_one: formatTime_one,
  get,
  post,
  put,
  remove
}

