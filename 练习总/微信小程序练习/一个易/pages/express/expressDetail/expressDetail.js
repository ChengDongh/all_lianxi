// pages/express/expressDetail/expressDetail.js
var ktop = require('../../../utils/ktop.js')
var utils = require('../../../utils/util.js')
var WxNotificationCenter = require("../../../utils/WxNotificationCenter.js")
Page({
  data: {
    need_identity: 0,
    express_id: null,
    express: null,
    currentExpress: {},
    isShow: false,
    area: null,
    provinces: [],
    citys: [],
    districts: [],
    index: [],
    address: null,
  },
  onLoad: function (options) {
    let addressid = options.addressid ? options.addressid:null;
    this.setData({
      express_id: addressid,
    })
    if (addressid)
    {
      this.getaddress();
    }
    this.loadArea();

    // var need_identity = options.need_identity
    // var express_id = options.express_id;
    // var app = getApp()
    // var exp = app.edit_express
    // if (express_id) {
    //   this.setData({
    //     express: exp,
    //     express_id: express_id,
    //     need_identity: need_identity ? need_identity : 0
    //   })
    // }
    // this.setData({
    //   currentExpress: exp ? exp : {},
    //   need_identity: need_identity ? need_identity : 0
    // })
    // var a = wx.getStorageSync("area")
    // if (a) {
    //   this.setData({
    //     area: a,
    //     index: [0, 0, 0]
    //   })
    //   this.upArea()
    // }
    // this.loadArea(a ? a.currentVersion : '')
    // WxNotificationCenter.addNotification("expressIdCardChangeNotification", this.expressIdCardChange, this)
  },
  getaddress:function(){
    let that=this;
    let openid=wx.getStorageSync('openid');
    ktop.request({
      api:"/getUserAddress1",
      data:{
        openid: openid,
        id: this.data.express_id
      }
      ,
      finish:function(res){
        if (res.code == 0) {
          that.setData({
            currentExpress: res.data
          })
        } else {
          console.log(res.msg)
        }
      }
    })
  },
  loadArea: function () {
    var that = this;
    /*ktop.request({
      api: "kml.exp.checkAreaInfo",
      loading: false,
      data: {
        areaVersion: areaVersion
      },
      finish: function (res, code) {
        if (callback) {
          callback();
        }
        if (code == 0) {
          if (res.needUpdate > 0) {
            that.setData({
              area: res,
              index: [0, 0, 0]
            })
            that.upArea()
            wx.setStorageSync("area", res)
          }
        }
      }
    })*/
    ktop.request({
      api:"/getProvince",
      finish:function(res){
        that.setData({
          area: res.data,
          index: [0, 0, 0]
        })
        wx.setStorageSync("area", res.data)
        that.upArea()
      }
    })
  },
  bindChange: function (e) {  
    var value = e.detail.value
    var idx = this.data.index
    if (value[0] != idx[0]) {
      this.setData({
        index: [value[0], 0, 0]
      })
    } else if (value[1] != idx[1]) {
      this.setData({
        index: [value[0], value[1], 0]
      })
    } else if (value[2] != idx[2]) {
      this.setData({
        index: [value[0], value[1], value[2]]
      })
    }
    this.upArea()
  },
  upArea: function () {
    const that = this
    new Promise((resolve,reject) => {
      var indx = this.data.index;
      var ar = this.data.area;
      var ps = ar;
      var cs = [];
      var ds = [];
      ktop.request({
        api:'/getCity',
        data: {
          provinceId: ar[indx[0]].provinceID
        },finish:function(res){
          cs = res.data
          that.setData({
            provinces: ps,
            citys: cs
          })
          resolve(cs[indx[1]].cityID)
        }
      })
    }).then(function(id) {
      ktop.request({
        api:'/getArea',
        data: {
          cityId: id
        },finish:function(res){
          that.setData({
            districts: res.data
          })
        }
      })
    })
  },
  onUnload: function () {
    // 页面关闭
    var that = this
    WxNotificationCenter.removeNotification("expressIdCardChangeNotification", that)
  },
  inputName: function (e) {
    var name = e.detail.value
    var currentExpress = this.data.currentExpress;
    currentExpress.name = name
    this.setData({
      currentExpress: currentExpress
    })
  },
  inputDetailAdress: function (e) {
    var detail_address = e.detail.value
    var currentExpress = this.data.currentExpress;
    currentExpress.location = detail_address
    this.setData({
      currentExpress: currentExpress
    })
  },
  inputMobile: function (e) {
    var mobile = e.detail.value
    var currentExpress = this.data.currentExpress;
    currentExpress.mobile = mobile
    this.setData({
      currentExpress: currentExpress
    })
  },
  selectCity: function () {
    var isShow = this.data.isShow;
    this.setData({
      isShow: !isShow
    })
  },
  pickerHide: function () {
    this.selectCity();
  },
  saveCity: function () {
    var index = this.data.index;
    var currentExpress = this.data.currentExpress;
    console.log(currentExpress)
    currentExpress.province = this.data.provinces[index[0]].province;
    currentExpress.province_id = this.data.provinces[index[0]].provinceID;
    currentExpress.city = this.data.citys[index[1]].city;
    currentExpress.city_id = this.data.citys[index[1]].cityID;
    currentExpress.area = this.data.districts[index[2]].area;
    currentExpress.area_id = this.data.districts[index[2]].areaID;
    this.setData({
      currentExpress: currentExpress
    })
    this.selectCity()
  },
  //身份证信息
  upIdCard: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var app = getApp()
    app.idcard_express = this.data.currentExpress
    wx.navigateTo({
      url: '/pages/express/idCard/expressIdCard?need_identity=' + this.data.need_identity,
      complete: function () {
        wx.hideToast()
      }
    })

  },
  // 保存
  save: function () {
    var that = this;
    if (!that.check()) {
      return;
    }
    var currentExpress = that.data.currentExpress;
    /*var api = that.data.express ? "kml.exp.editAddress" : "kml.exp.addAddress"
    ktop.request({
      api: api,
      loading: true,
      data: {
        id: that.data.express ? currentExpress.id : "",
        name: currentExpress.name,
        mobile: currentExpress.mobile,
        province_id: currentExpress.province_id,
        province: currentExpress.currentExpress,
        city_id: currentExpress.city_id,
        city: currentExpress.city,
        districtId: currentExpress.district_id,
        district: currentExpress.district,
        location: currentExpress.location,
        cardId: currentExpress.id_card ? currentExpress.id_card : "",
        cardName: currentExpress.id_name ? currentExpress.id_name : "",
        cardPositive: currentExpress.positive_card_url ? currentExpress.positive_card_url : "",
        cardNegative: currentExpress.negative_card_url ? currentExpress.negative_card_url : ""
      },
      finish: function (res, code) {
        if (code == 0) {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
              WxNotificationCenter.postNotificationName("expressStateChangeNotification");
              WxNotificationCenter.postNotificationName("expressChooseNotification", currentExpress)
            },
          })
        }
      }
    })*/
    const openid = wx.getStorageSync('openid')
    ktop.request({
      api:"/addressUpdate",
      data: {
        id: that.data.express_id ? that.data.express_id : "",
        name: currentExpress.name,
        mobile: currentExpress.mobile,
        province_id: currentExpress.province_id,
        province: currentExpress.province,
        city_id: currentExpress.city_id,
        city: currentExpress.city,
        area_id: currentExpress.area_id,
        area: currentExpress.area,
        location: currentExpress.location,
        openid: openid
        /*cardId: currentExpress.id_card ? currentExpress.id_card : "",
        cardName: currentExpress.id_name ? currentExpress.id_name : "",
        cardPositive: currentExpress.positive_card_url ? currentExpress.positive_card_url : "",
        cardNegative: currentExpress.negative_card_url ? currentExpress.negative_card_url : ""*/
      },finish:function(res){
        console.log(res);
        if (res.code === 0) {
          that.setData({
            express_id: res.data.id
          })
          currentExpress.id = res.data.id;
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showModal({
            title: '出错',
            content: res.msg,
          })
        }
      }
    })
  },
  check: function () {
    var currentExpress = this.data.currentExpress
    var errorMsg = ""
    if (!currentExpress.name) {
      errorMsg += "请填写收件人姓名 \n"
    }
    if (!currentExpress.province_id) {
      errorMsg += "请选择省市区 \n "
    }
    if (!currentExpress.location) {
      errorMsg += "请填写详细地址\n"
    }
    if (!currentExpress.mobile) {
      errorMsg += "请填写手机号码\n"
    }
    if (!utils.isphone(currentExpress.mobile) && currentExpress.mobile) {
      errorMsg += "手机号码格式不正确\n"
    }
    /*if (this.data.need_identity > 0) {
      if (!currentExpress.id_card || currentExpress.id_card.length == 0) {
        errorMsg += "请完善身份证信息\n"
      } else if (this.data.need_identity == 1 && (!currentExpress.negative_card_url || currentExpress.negative_card_url.length == 0)) {
        errorMsg += "请上传身份证照片\n"
      }
    }*/
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
  expressIdCardChange: function (e) {
    if (e) {
      this.setData({
        currentExpress: e
      })
    }
  },
  onUnload: function () {
    if (this.data.express_id > 0) {
      var app = getApp()
      app.edit_express = null
    }
  },
  addressChange: function (e) {
    var address = e.detail.value
    this.setData({
      address: address
    })
  },
  autocheck: function (e) {
    var address = this.data.address
    var that = this
    ktop.request({
      api: "kml.exp.parseAddress",
      loading: true,
      data: {
        address: address
      },
      finish: function (res, code) {
        if (code == 0) {
          that.setData({
            currentExpress: res
          })
        }
      }
    })
  }
})