var ktop = require('../../utils/ktop.js')
Page({
  data: {
    box: [],
    orderid: null,
    order: null,
    checked: false
  },
  onLoad: function(options) {
    let orderid = options.orderid ? options.orderid : null;
    this.setData({
      orderid
    })
    this.getorder();
  },
  getorder: function() {
    let that = this;
    ktop.request({
      api: '/orderDetail',
      data: {
        openid: wx.getStorageSync('openid'),
        order_id: this.data.orderid
      },
      finish: function(res) {
        console.log(res);
        if (res.code == 0) {
          let box = [];
          for (let i of res.data.order_detail) {
            box.push({
              id: i.id,
              appraise_desc: '',
              appraise_images: []
            });
          }
          that.setData({
            order: res.data,
            box
          })
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      }
    })
  },
  select: function() {
    this.setData({
      checked: !this.data.checked,
    })
  },
  chooseImage: function(e) {
    var that = this
    var box = that.data.box;
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 3 - box[e.target.dataset.index].appraise_images.length,
      success: function(res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var item = {
            tempPath: res.tempFilePaths[i]
          }
          box[e.target.dataset.index].appraise_images.push(item);
          that.uploadFile(e.target.dataset.index);
        }
        that.setData({
          box
        })
      }
    })
  },
  cancelimg:function(e){
    let index = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.indexs;
    let imglist=this.data.box;
    imglist[index].appraise_images.splice(index2,1);
    this.setData({
      box: imglist
    })
  },
  uploadFile: function(index1) {
    let box = this.data.box;
    var item = box[index1].appraise_images[box[index1].appraise_images.length - 1];
    var that = this;
    ktop.uploadFile({
      path: item.tempPath,
      finish: function(res) {
        let ress = JSON.parse(res)
        if (ress.code == 0) {
          item.url = ress.data.url
        }
        that.setData({
          box
        })
      }
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src;
    var images = this.data.box[e.target.dataset.index].appraise_images.map(function(item) {
      return item.tempPath
    })
    wx.previewImage({
      current: current.tempPath,
      urls: images
    })
  },
  contentChange: function(e) {
    let box = this.data.box;
    box[e.target.dataset.index].appraise_desc = e.detail.value;
    this.setData({
      box
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
  summit: function() {
    let order = this.data.box;
    for (let i of order) {
      let imglist = [];
      for (let j of i.appraise_images) {
        imglist.push(j.url);
      }
      i.appraise_images = imglist.join(',');
    }
    ktop.request({
      api: '/orderAppraise',
      data: {
        openid: wx.getStorageSync('openid'),
        order_detail: JSON.stringify(order),
        appraise_anonymous: this.data.checked ? 1 : 0
      },
      finish: function(res) {
        if (res.code == 0) {
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      }
    })
  }
})