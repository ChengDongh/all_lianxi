// pages/address/address.js
var utils = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    show: false,
    currentExpress: {},
    index: [],
    provinces: [],
    citys: [],
    districts: [],
    id: '',
    defaultCheck:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let addressid = options.id ? options.id : '';
    this.setData({
      openid: wx.getStorageSync('openid'),
      id: addressid
    })
    if (addressid){
      this.getAddress();
    }else{
      this.getProvince();
    }
  },
  getAddress:function(){
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/getAllAddress',
      method: 'POST',
      data: {
        openid: that.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 200){
          var addressAll = res.data.data;
          var currentExpress = that.data.currentExpress
          for (let i in addressAll){
            if (addressAll[i].id == that.data.id){
              currentExpress = addressAll[i];
            }
          }
          that.setData({
            currentExpress
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  getProvince:function(){
    var that = this;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/getProvince',
      method: 'POST',
      data: {
        openid: that.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       that.setData({
         provinces:res.data.data,
         index:[0,0,0]
       })
       that.getCity();
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  getCity:function(){
    var that = this;
    var provinces = that.data.provinces;
    var inde = that.data.index;
    new Promise(function(resolve,reject){
      wx.request({
        url: 'http://hisin.natapp1.cc/address/getCity',
        method: 'POST',
        data: {
          openid: that.data.openid,
          provinceId: provinces[inde[0]].provinceId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            citys: res.data.data,
          })
          resolve(res.data.data[inde[1]].cityId)
        },
      })
    }).then(function (cityId) {
      wx.request({
        url: 'http://hisin.natapp1.cc/address/getArea',
        method: 'POST',
        data: {
          openid: that.data.openid,
          cityId: cityId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            districts: res.data.data,
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //获取input输入值
  addinfor: function(e) {
    var currentExpress = this.data.currentExpress;
    switch (e.currentTarget.dataset.index) {
      case 'name':
        currentExpress.name = e.detail.value
        break;
      case 'mobile':
        currentExpress.mobile = e.detail.value
        break;
      case 'location':
        currentExpress.location = e.detail.value
        break;
    }
    this.setData({
      currentExpress
    })
  },
  //select改变时触发
  bindChange: function(e) {
    var that = this;
    var value = e.detail.value
    var idx = that.data.index
    if (value[0] != idx[0]) {
      that.setData({
        index: [value[0], 0, 0]
      })
    } else if (value[1] != idx[1]) {
      that.setData({
        index: [value[0], value[1], 0]
      })
    } else if (value[2] != idx[2]) {
      that.setData({
        index: [value[0], value[1], value[2]]
      })
    }
    that.getCity();
  },
  //select选择器的开关
  selectCity: function() {
    var show = this.data.show;
    this.setData({
      show: !show
    })
  },
//保存下select选择器选择的值
  saveCity: function() {
    var index = this.data.index;
    var show = this.data.show;
    var currentExpress = this.data.currentExpress;
    currentExpress.province = this.data.provinces[index[0]].provinceName;
    currentExpress.provinceId = this.data.provinces[index[0]].provinceId;
    currentExpress.city = this.data.citys[index[1]].cityName;
    currentExpress.cityId = this.data.citys[index[1]].cityId;
    currentExpress.area = this.data.districts[index[2]].area;
    currentExpress.areaId = this.data.districts[index[2]].areaId;
    this.setData({
      currentExpress,
      show: !show
    })
  },
  switch1Change: function (e) {
    var defaultCheck = this.data.defaultCheck
    if (e.detail.value == true) {
      defaultCheck = 1
    } else {
      defaultCheck = 0
    }
    this.setData({
      defaultCheck
    })
  },
  //保存地址按钮
  saveAddress: function() {
    var that = this;
    var message = '';
    if (that.data.currentExpress.name == undefined) {
      message = '请输入姓名'
    } else if (!utils.isphone(that.data.currentExpress.mobile)) {
      message = '请输入正确的手机号'
    } else if (that.data.currentExpress.province == undefined) {
      message = '请选择地区'
    } else if (that.data.currentExpress.location == undefined) {
      message = '请填写详细地址'
    }
    if (message != '') {
      wx.showModal({
        title: '提示',
        content: message,
      })
    } else {
      var currentExpress = that.data.currentExpress;
      wx.request({
        url: 'http://hisin.natapp1.cc/address/saveOrUpdateAddress',
        method: 'POST',
        data: {
          openid: that.data.openid,
          id: that.data.id,
          name: that.data.currentExpress.name,
          mobile: that.data.currentExpress.mobile,
          location: that.data.currentExpress.location,
          provinceId: that.data.currentExpress.provinceId,
          province: that.data.currentExpress.province,
          cityId: that.data.currentExpress.cityId,
          city: that.data.currentExpress.city,
          areaId: that.data.currentExpress.areaId,
          area: that.data.currentExpress.area,
          defaultCheck: that.data.defaultCheck,
          discarded: '',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})