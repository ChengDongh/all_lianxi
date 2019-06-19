var utils = require("../../utils/util.js");
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    addressList: [],
    delBtnWidth: 110,
    id: null,
    isBack: 'true'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (JSON.stringify(options) != "{}") {
      this.setData({
        isBack: options.isBack
      })
    }
    this.setData({
      openid: wx.getStorageSync('openid')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getAddressAll();
  },
  getAddressAll:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://hisin.natapp1.cc/address//getAllAddress',
      method: 'POST',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            addressList: res.data.data
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
  },
  //修改地址
  edit: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address/address?id=' + id + '',
    })
  },
  //选择结算页面的地址
  selectTap: function(e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    if (that.data.isBack == 'true') {
      WxNotificationCenter.postNotificationName("changeaddressid", {
        addressid: id
      });
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //删除地址
  delItem: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: 'http://hisin.natapp1.cc/address/deleteAddress',
      method:'POST',
      data:{
        openid:that.data.openid,
        addressId: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        if(res.data.code == 200){
          that.getAddressAll();
        }
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  // 左滑功能(getEleWidth() initEleWidth() touchS() touchM() touchE())
  touchS: function(e) {
    var that = this;
    var addressList = that.data.addressList
    for (let i in addressList){
      if (addressList[i].left){
        addressList[i].left = "margin-left:0px"
      }
    }
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
      var addressList = this.data.addressList;
      if (index !== "" && index != null) {
        addressList[index].left = left;
        this.setData({
          addressList: addressList
        });
        // this.setGoodsList(list)
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
      var addressList = this.data.addressList;
      if (index !== "" && index != null) {
        addressList[index].left = left;
        this.setData({
          addressList: addressList
        });
        // this.setGoodsList(list)
      }
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