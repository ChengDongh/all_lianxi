var ktop = require('../../../utils/ktop.js')
var utils = require('../../../utils/util.js')
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js")

Page({
  data: {
    need_identity: 0,
    currentExpress: {},
  },
  onLoad: function (options) {
    var need_identity = options.need_identity ? options.need_identity : 0
    var app = getApp()
    var exp = app.idcard_express
    this.setData({
      currentExpress: exp ? exp : {},
      need_identity: need_identity
    })
  },
  selectImg: function (e) {
    var id = e.currentTarget.dataset.id
    var that = this;
    wx.chooseImage({
      sourceType: ['camera', 'album'],
      sizeType: ['compressed', 'original'],
      count: 1,
      success: function (res) {
        var temp = res.tempFilePaths[0]
        that.uploadFile(temp, id)
      }
    })
  },
  uploadFile: function (item, id) {
    var that = this
    ktop.uploadFile({
      path: item,
      finish: function (res, code) {
        if (code == 0) {
          var currentExpress = that.data.currentExpress;
          if (id > 1) {
            currentExpress.positive_card_url = res;
          } else {
            currentExpress.negative_card_url = res;
          }
          that.setData({
            currentExpress: currentExpress,
          })
        }
      }
    })
  },
  inputName: function (e) {
    var name = e.detail.value;
    var currentExpress = this.data.currentExpress;
    currentExpress.id_name = name;
    currentExpress.real_name = name;
    this.setData({
      currentExpress: currentExpress,
    })
  },
  inputIdCard: function (e) {
    var idCard = e.detail.value;
    var currentExpress = this.data.currentExpress;
    currentExpress.id_card = idCard;
    this.setData({
      currentExpress: currentExpress,
    })
  },
  save: function () {
    var that = this;
    if (!that.check()) {
      return;
    }
    wx.navigateBack({
      delta: 1,
      success: function (res) {
        WxNotificationCenter.postNotificationName("expressIdCardChangeNotification", that.data.currentExpress);
      }
    })
  },
  check: function () {
    var currentExpress = this.data.currentExpress
    var errorMsg = ""
    if (this.data.need_identity == 1) {
      if (!currentExpress.negative_card_url) {
        errorMsg += "请上传身份证正面 \n"
      }
      if (!currentExpress.positive_card_url) {
        errorMsg += "请上传身份证反面 \n "
      }
    }
    if (!currentExpress.id_name) {
      errorMsg += "请填写姓名\n"
    }
    if (!currentExpress.id_card) {
      errorMsg += "请填写身份证号码\n"
    }
    if (!utils.isIdCard(currentExpress.id_card) && currentExpress.id_card) {
      errorMsg += "身份证号码格式不正确\n"
    }
    if (errorMsg.length > 0) {
      wx.showModal({
        title: '提示',
        content: errorMsg,
        showCancel: false
      })
      return false;
    }
    return true;
  },
  onUnload: function () {
    // 页面关闭
    var app = getApp()
    app.idcard_express = null
  }
})