var ktop = require('../../utils/ktop.js')
var utils = require("../../utils/util.js");

Page({
  data: {
    activityId: 0,
  },
  onLoad: function (options) {
    if (options.activityId > 0) {
      this.setData({
        activityId: options.activityId
      })
    } else  if (options.q) {
      
    }
    this.loadData()
  },
  loadData: function (callback) {
    var that = this
    ktop.request({
      api: "kml.a.getActivity",
      data: {
        activityId: that.data.activityId
      },
      loading: true,
      finish: function (res, code) {
        callback && callback();
        if (code > 0) {
          return;
        }
        that.setData(res)
        wx.setNavigationBarTitle({
          title: res.title
        })
      }
    })
  },
  onShow: function () {
    var app = getApp()
    if (app.user.id) {
        if(this.data.products.length == 0) {
            this.loadData()
        }
    } else {
      wx.redirectTo({
        url: '/pages/welcome/welcome'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      desc: '全球正品货源S2B服务专家,无需囤货，零库存低风险，一件代发,无忧售后',
      path: '/pages/activity/activity?activityId='+this.data.activityId
    }
  },
  banner_imageLoad: function (e) {
    var imageHeight = utils.imageUtil(e)
    this.setData({ imageHeight: imageHeight })
  },
  head_imageLoad: function (e) {
    var imageHeight = utils.imageUtil(e)
    var index = e.currentTarget.dataset.index
    var activitySettingInfos = this.data.activitySettingInfos
    activitySettingInfos[index].imageHeight = imageHeight
    this.setData({ activitySettingInfos: activitySettingInfos })
  }
})