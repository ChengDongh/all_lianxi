//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    
  },
  go:function(e){
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/checkpoints/checkpoints?index=' + index,
    })
  },
})
