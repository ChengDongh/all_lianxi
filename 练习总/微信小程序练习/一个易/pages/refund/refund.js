// pages/refund/refund.js
var ktop = require('../../utils/ktop.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var utils = require("../../utils/util.js");
const md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: ['未收到货', '已收到货'],
    indexs: 0,
    reason: ['多买/买错/不想要', '快递无记录', '少货/空包裹', '商家一直未发货', '快递一直未送达', '其他'],
    indexr: 0,
    type: ['仅退款', '退货退款'],
    indext: 0,
    images: [],
    orderid: null,
    order: null,
    mobile: null,
    message: null,
    addshow:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
      api: '/orderDetail1',
      data: {
        openid: wx.getStorageSync('openid'),
        order_detail_id: this.data.orderid
      },
      finish: function(res) {
        console.log(res)
        if (res.code == 0) {
          res.data.time = utils.formatTime(res.data.pay_time, 1)
          that.setData({
            order: res.data
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  typeselect: function(e) {
    console.log(e)
    switch (e.currentTarget.dataset.index) {
      case 'indext':
        this.setData({
          indext: e.detail.value
        })
        break;
      case 'indexs':
        this.setData({
          indexs: e.detail.value
        })
        break;
      case 'indexr':
        this.setData({
          indexr: e.detail.value
        })
        break;
    }
  },
  upimage: function() {
    let images = this.data.images;
    let that = this;
    wx.chooseImage({
      count: 5 - this.data.images.length,
      success: function(res) {
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          var item = {
            tempPath: res.tempFilePaths[i]
          }
          images.push(item)
          that.uploadFile()
        }
        that.setData({
          images: images,
          addshow: images.length < 5
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  uploadFile: function() {
    let images = this.data.images;
    var item = images[images.length - 1];
    var that = this;
    ktop.uploadFile({
      path: item.tempPath,
      finish: function(res) {
        let ress = JSON.parse(res)
        if (ress.code == 0) {
          item.url = ress.data.url;
          that.setData({
            images: images,
          })
        } else {
          wx.showToast({
            title: ress.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  mobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  message: function(e) {
    this.setData({
      message: e.detail.value
    })
  },
  refund: function() {
    if (!utils.isphone(this.data.mobile)) {
      wx.showToast({
        title: '请填写正确的手机号码！',
        icon: 'none'
      })
      return false;
    }
    let imglist = this.data.images;
    let imglist1 = [];
    for (let i of imglist) {
      console.log(1)
      imglist1.push(i.url)
    }
    imglist1=imglist1.join(',');
    ktop.request({
      api: '/orderRefunding',
      data: {
        openid:wx.getStorageSync('openid'),
        order_detail_id: this.data.orderid,
        refund_process_type: this.data.type[this.data.indext],
        refund_product_state: this.data.state[this.data.indexs],
        refund_reason: this.data.reason[this.data.indexr],
        refund_mobile: this.data.mobile,
        refund_desc: this.data.message ? this.data.message : '',
        refund_images: imglist1
      },
      finish: function(res) {
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'success',
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta:1
                })
              },1500)
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
  },
  cancelimg: function (e) {//删除图片
    let index = e.currentTarget.dataset.index;
    let images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images,
      addshow: images.length < 5
    })
  },
})