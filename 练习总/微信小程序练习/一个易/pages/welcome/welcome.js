Page({
  data: {

  },
  onShow: function () {
    var app = getApp()
    if (app.user.id) {
      wx.switchTab({
        url: '/pages/market/market'
      })
    }
  },
  callServer: function () {
    wx.makePhoneCall({
      phoneNumber: '4000449555'
    })
  }
})
