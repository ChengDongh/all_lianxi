//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    level:0,
    isCharging:false,
    contents: '这是可以复制的文字,粘贴后即可看到效果'
  },
  onLoad: function () {
    var that = this;
    wx.getBatteryInfo({
      success(res){
        console.log(res)
        that.setData({
          level: res.level,
          isCharging: res.isCharging
        })
      }
    })
  },
  call: function(){
    wx.makePhoneCall({
      phoneNumber: '10000' //仅为示例，并非真实的电话号码
    })
  },
  scanCode:function(){
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },
  copyText: function (e) {
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res)
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})
