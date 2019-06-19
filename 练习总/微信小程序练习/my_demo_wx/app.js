//app.js
App({
  onLaunch: function(options) {
    // 登录
    // var openid = wx.getStorageSync('openid');
    // if (!openid) {
    //   this.getOpenid();
    // } else {
    //   this.getUserInfor();
    // }
    // 获取用户信息
  },
  getOpenid: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    return new Promise(function(resolve, reject) {
      wx.login({
        success: r => {
          if (r.code) {
            wx.request({
              url: 'http://hisin.natapp1.cc/user/login',
              method: "post",
              data: {
                code: r.code,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' 
              },
              success: (res) => {
                if (res.data.code == 200) {
                  wx.hideLoading();
                  let openid = res.data.data;
                  wx.setStorageSync('openid', openid);
                  var res = {
                    status: 200,
                    data: res.data.data
                  }
                  resolve(res);
                  that.getUserInfor();
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              },
              fail: (res) => {
                wx.showToast({
                  title: JSON.stringify(res),
                })
              }
            })
          }else{
            reject('error')
          }
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail: r => {
          wx.showToast({
            title: JSON.stringify(r),
          })
        },
      })
    })
  },
  getUserInfor: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 上传用户信息给后台
              // wx.request({
              //   method: "post",
              //   url: 'https://newyear.qiqiangkeji.com/xcxUnionid',
              //   data: {
              //     openid: wx.getStorageSync('openid'),
              //     iv: res.iv,
              //     encryptedData: res.encryptedData
              //   },
              //   success: (res) => {

              //   }
              // })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    loginCode: null,
    version: '1.0.0',
    host: 'http://hisin.natapp1.cc'
  }
})