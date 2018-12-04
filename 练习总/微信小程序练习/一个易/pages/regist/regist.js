var utils = require("../../utils/util.js");
var ktop = require('../../utils/ktop.js')
var md5 = require("../../utils/md5.js");

Page({
  data: {
    registBtnTxt: "立即注册",
    registBtnBgBgColor: "#f3244b",
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#f3244b",
    btnLoading: false,
    counting: false,
    registDisabled: true,
    smsCodeDisabled: true,
    invitCode: '',
    mobile: '',
    smscode: '',
    passward: ''
  },
  inviteCodeChange: function (e) {
    var invitCode = e.detail.value
    this.setData({
      invitCode: invitCode,
    })
  },
  mobileChange: function (e) {
    var mobile = e.detail.value
    var smscode = this.data.smscode
    this.setData({
      mobile: mobile,
      smsCodeDisabled: mobile.length < 11
    })
    this.checkBtnState()
  },
  smsCodeChange: function (e) {
    var smscode = e.detail.value
    var mobile = this.data.mobile
    this.setData({
      smscode: smscode
    })
    this.checkBtnState()
  },
  passwardChange: function (e) {
    var passward = e.detail.value
    this.setData({
      passward: passward,
    })
    this.checkBtnState()
  },
  checkBtnState: function () {
    var enable = this.data.mobile.length == 11 && this.data.smscode.length > 0 && this.data.passward.length > 0  && this.data.invitCode.length > 0
    this.setData({
      registDisabled: !enable,
    })
  },
  getSmsCode: function () {
    var mobile = this.data.mobile
    if (!utils.isphone(mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'loading'
      });
      return
    }
    if (this.data.counting) {
      return
    }
    var that = this;
    var count = 60;
    that.setData({
      counting: true
    })
    var si = setInterval(function () {
      if (count > 0) {
        count--;
        that.setData({
          getSmsCodeBtnTxt: count + ' s',
          getSmsCodeBtnColor: "#999",
          smsCodeDisabled: true
        });
      } else {
        that.setData({
          getSmsCodeBtnTxt: "获取验证码",
          getSmsCodeBtnColor: "#f3244b",
          smsCodeDisabled: false,
          counting: false
        });
        clearInterval(si);
      }
    }, 1000);
    // 发验证码
    var sign = md5.hex_md5(mobile + "a_d_j_!@#$%^&*()")
    ktop.request({
      api: "kml.util.sms",
      loading: true,
      data: {
        mobile: mobile,
        smsSign: sign,
        smsType: "reg"
      },
      finish: function (res, code) {
        if (code == 0) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
        } else {
          that.setData({
            getSmsCodeBtnTxt: "获取验证码",
            getSmsCodeBtnColor: "#f3244b",
            smsCodeDisabled: false,
            counting: false
          });
          clearInterval(si);
        }
        if (res.code == 1006) { // 号码已注册请直接绑定
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/bindmobile/bindmobile?mobile=' + that.data.mobile
            })
          }, 1500)
        }
      }
    })
  },
  formSubmit: function (e) {
    var param = e.detail.value;
    if (!utils.isphone(this.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'loading'
      });
      return
    }
    var that = this
    var app = getApp()
    var wxToken = app.wxToken
    if (!wxToken) {
      wx.showToast({
        title: '请先授权',
        icon: 'success'
      });
      app.getUserInfo()
      return;
    }
    this.setregistData1();
    var password = md5.hex_md5(param.passward)
    var that = this
    ktop.request({
      api: "kml.wxsp.register",
      loading: true,
      data: {
        mobile: param.mobile,
        verifycode: param.smsCode,
        inviteCode: param.inviteCode,
        password: password,
        wxToken: wxToken
      },
      finish: function (res, code) {
        if (code == 0) {
          app.setUser(res)
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          })
          wx.switchTab({
            url: '/pages/market/market'
          })
        } else {
          that.setregistData2()
        }
      }
    })
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "注册中",
      registDisabled: true,
      registBtnBgBgColor: "#999",
      btnLoading: true
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "立即注册",
      registDisabled: false,
      registBtnBgBgColor: "#f3244b",
      btnLoading: false
    });
  },
  showWechatCode: function () {
    wx.previewImage({
      urls: ["http://image.aidaojiacdn.com/035a5555c14836baecdfd21f0fc9b7b8_336x336.png"]
    })
  }
})