var ktop = require('../../utils/ktop.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({
  data: {
    senders: []
  },
  onLoad: function () {
    this.loadData(0)
  },
  onPullDownRefresh: function () {
    this.loadData(0,
      function () {
        wx.stopPullDownRefresh()
      }
    )
  },
  onReachBottom: function () {
    this.loadData(this.data.senders.length)
  },
  loadData: function (offset, callback) {
    var that = this
    /*ktop.request({
      api: "kml.exp.senderAddressList",
      data: {
        offset: offset,
        limit: 10
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        if (offset == 0) {
          that.setData({ senders: res })
        } else {
          that.setData({ senders: that.data.senders.concat(res) })
        }
      }
    })*/
    wx.request({
      url: 'https://newyear.qiqiangkeji.com/getUserAddress',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: 'ocK2l0ay-goNPsNEuOhCioPaEfDg'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          senders: res.data.data
        })
      }
    })
  },
  select: function (e) {
    var sender = e.currentTarget.dataset.sender
    WxNotificationCenter.postNotificationName("senderChooseNotification", sender)
    /*const app = getApp();
    app.sender = sender;*/
    wx.navigateBack()
  }
})