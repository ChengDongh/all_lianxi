var ktop = require('utils/ktop.js')
App({
  onLaunch: function(options) {
    /*wx.redirectTo({
      url: '/pages/product/product?id=1'
    })/*fightGroups|fightProduct?id=256&refOpenid=true*/
    const refId = options.query.refOpenid
    if (refId && refId !== wx.getStorageSync('openid')) {
      wx.setStorageSync('refOpenid', refId)
    }
    //调用API从本地缓存中获取数据
    var openid = wx.getStorageSync('openid')
    if (openid) {
      this.openid = openid
    } else {
      this.getUserInfo();
    }
    this.appAuth();


  },
  getUserInfo: function(type = 0) {
    var that = this
    wx.login({
      success: function(r) {
        wx.request({
          url: 'https://yiapi.qiqiangkeji.com/wxOpenid',
          method: 'POST',
          data: {
            code: r.code,
          },
          success: function(res) {
            if (res.data.code == 0) {
              var openid = res.data.data[0];
              wx.setStorageSync('openid', openid);
       
            } else {
              console.log(res.data.msg);
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          },
          fail: function(err) {
            console.log(err)
          }
        })
      }
    })
  },
  appAuth: function() {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) //已经授权获取头像
        {
          wx.getUserInfo({
            success: function (info) {
              wx.request({
                url: 'https://yiapi.qiqiangkeji.com/xcxUnionid',
                data: {
                  openid: wx.getStorageSync('openid'),
                  iv: info.iv,
                  encryptedData: info.encryptedData
                },
                method: 'POST',
                success: function (res) {
                  // wx.setStorageSync('unionId', res.data.data[0]);
                }
              })
            }
          })
        } else {
        wx.reLaunch({
          url: '/pages/authuser/authuser'
        })
        }
      }
    })
  },
  user: {
    user_level: 1
  },
  setUser: function(u) {
    this.user = u
    wx.setStorageSync('user', u)
  },
  isAuthed: false
})
/*{
        "pagePath": "pages/shop_cart/shop_cart",
        "text": "购物车",
        "iconPath": "resource/image/icon-cart.png",
        "selectedIconPath": "resource/image/icon-cart1.png"
      },*/