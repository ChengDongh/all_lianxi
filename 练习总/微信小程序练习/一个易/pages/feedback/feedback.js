var ktop = require('../../utils/ktop.js')
Page({
  data: {
    type: "采购需求",
    imageList: [],
    showAdd: true,
    summitDisable: true,
    content: ""
  },
  chooseType: function() {
    var types = ["采购需求", "其他"]
    var that = this
    wx.showActionSheet({
      itemList: types,
      success: function(res) {
        that.setData({
          type: types[res.tapIndex]
        })
      }
    })
  },
  chooseImage: function() {
    var that = this
    var imageList = that.data.imageList
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 3 - imageList.length,
      success: function(res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var item = {
            tempPath: res.tempFilePaths[i]
          }
          imageList.push(item)
          that.uploadFile()
        }
        that.setData({
          imageList: imageList,
          showAdd: imageList.length < 3
        })
      }
    })
  },
  uploadFile: function() {
    let imageList = this.data.imageList;
    var item = imageList[imageList.length - 1]
    var that = this;
    ktop.uploadFile({
      path: item.tempPath,
      finish: function(res) {
        let ress = JSON.parse(res);
        console.log(ress)
        if (ress.code == 0) {
          item.url = ress.data.url;
        }
        that.setData({
          imageList: imageList,
        })
      }
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src
    var images = this.data.imageList.map(function(item) {
      return item.tempPath
    })
    wx.previewImage({
      current: current.tempPath,
      urls: images
    })
  },
  serviceMobile: function(e) {
    wx.makePhoneCall({
      phoneNumber: '4000449555'
    })
  },
  contentChange: function(e) {
    var content = e.detail.value
    this.setData({
      content: content,
      summitDisable: content.length == 0
    })
  },
  cancelimg:function(e){//删除图片
    let index = e.currentTarget.dataset.index;
    let imageList = this.data.imageList;
    imageList.splice(index,1);
    this.setData({
      imageList,
      showAdd: imageList.length < 3
    })
  },
  checkImage: function(callback) {
    var picUrl = ""
    var imageList = this.data.imageList
    var needWait = false
    if (imageList.length > 0) {
      for (var i = 0; i < imageList.length; i++) {
        var item = imageList[i]
        if (!item.url) {
          this.uploadFile(i)
          needWait = true
          break
        } else {
          picUrl += item.url
          if (i < imageList.length - 1) {
            picUrl += ','
          }
        }
      }
      if (needWait) {
        var that = this
        setTimeout(
          function() {
            that.checkImage(callback)
          }, 200
        )
      } else {
        callback(picUrl)
      }
    } else {
      callback("")
    }
  },
  summit: function(e) {
    let imageList = this.data.imageList;
    let img = [];
    for (let i of imageList) {
      img.push(i.url);
    }
    img = img.join(',')
    ktop.request({
      api: '/feedback',
      data: {
        openid: wx.getStorageSync('openid'),
        content: this.data.content,
        images: img,
      },
      finish: function(res) {
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})