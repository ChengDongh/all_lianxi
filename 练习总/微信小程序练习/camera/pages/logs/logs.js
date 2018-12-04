//logs.js
const util = require('../../utils/util.js')
// var ktop = require('../../utils/ktop.js')
Page({
  data: {
    src: []
  },
  Photo() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        wx.uploadFile({
          url: 'https://yiapi.qiqiangkeji.com/upload',
          filePath: tempFilePaths[0],
          name: 'img',
          success: function (res) {
            var data = JSON.parse(res.data);
            if(data.code == 0){
              console.log(155555);
              var src = that.data.src
              src.push(data.data.url)
              that.setData({
                src:src
              })
            }
          },
          fail: function () {
            
          }
        })
      }
    })

  },
  
  previewImage(e) {
    wx.previewImage({
      current: e.target.dataset.src,
      urls: this.data.src,
    })
  }
})