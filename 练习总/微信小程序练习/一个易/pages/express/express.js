var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({
  data: {
    expressArray: [], //地址列表
    fromplaceorder: false,
    fromid: null,
    need_identity: 0, //是否需要身份证:0不需要，1需要, 2只需要身份证号码'
    delBtnWidth: 60,
  },
  onLoad: function(options) {
    // var need_identity = options.need_identity
    this.setData({
      fromplaceorder: options.fromplaceorder ? true : false
      // need_identity: need_identity ? need_identity : 0
    })
    // WxNotificationCenter.addNotification("expressStateChangeNotification", this.expressChange, this)
    // if (this.data.expressArray.length == 0) {
    //   this.loadData(0)
    // }

  },
  onShow: function() {
    this.loadData();
  },
  onUnload: function() {
    // 页面关闭  移除通知
    var that = this;  
    // WxNotificationCenter.removeNotification("expressStateChangeNotification", that)
  },
  backaddress: function(e) { //返回选择地址
    let id = e.currentTarget.dataset.express.id;
    if (this.data.fromplaceorder == true) {
      // let pagelist = getCurrentPages();
      // let prePage = pagelist[pagelist.length - 2]
      // prePage.getBackData({ fromid: this.data.fromid, addressid: id })
      WxNotificationCenter.postNotificationName("changeaddressid", {
        addressid: id
      });
      wx.navigateBack({
        delta: 1
      })
    }
  },
  loadData: function(offset, callback) {
    wx.showLoading({
      title:'加载中'
    });
    var that = this
    const openid = wx.getStorageSync('openid')
    ktop.request({
      api: "/getUserAddress",
      data: {
        openid: openid
      },
      finish: function(res) {
        wx.hideLoading();
        if (res.code == 0) {
          that.setData({
            expressArray: res.data
          })
        } else {
          console.log(res.msg)
        }

      }
    })

  },
  onPullDownRefresh: function() {
    this.loadData(0, function() {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function() {
    this.loadData(this.data.expressArray.length)
  },
  addaddress: function() {
    wx.navigateTo({
      url: '/pages/express/expressDetail/expressDetail'
    })
  },
  //编辑收货地址
  goExpressDetail: function(e) {
    let editid = e.currentTarget.dataset.id;
    var url = '/pages/express/expressDetail/expressDetail?addressid=' + editid + '';
    wx.navigateTo({
      url: url
    })
  },
  expressChange: function() {
    this.loadData(0)
  },
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        } else {
          left = "margin-left:-" + disX + "px";
        }
      }
      var list = this.data.expressArray;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          expressArray: list
        })
      }
    }
  },

  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      var list = this.data.expressArray;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          expressArray: list
        })
      }
    }
  },
  delItem: function(e) {
    let index = e.target.dataset.index;
    let id = this.data.expressArray[index].id;
    let that = this;
    wx.showModal({
      title: '删除?',
      content: '确认删除该地址吗?',
      success: function(res) {
        if (res.confirm) {
          ktop.request({
            api: '/delAddress',
            data: {
              openid: wx.getStorageSync('openid'),
              id: id
            },
            finish: function(res) {
              console.log(res)
              if (res.code == 0) {
                wx.showToast({
                  title: res.msg,
                  icon: 'success',
                  success: function() {
                    that.loadData();
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
      }

    })
  }
})