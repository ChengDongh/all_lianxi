// pages/checkpoints/checkpoints.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrs:[
      {
        index:1,
        Istrue:true,
      },
      {
        index: 2,
        Istrue: false,
      },
      {
        index: 3,
        Istrue: false,
      },
      {
        index: 4,
        Istrue: false,
      },
      {
        index: 5,
        Istrue: false,
      },
      {
        index: 6,
        Istrue: false,
      },
      {
        index: 7,
        Istrue: false,
      },
      {
        index: 8,
        Istrue: false,
      },
      {
        index: 9,
        Istrue: false,
      },
      {
        index: 10,
        Istrue: false,
      },
      {
        index: 11,
        Istrue: false,
      },
      {
        index: 12,
        Istrue: false,
      },
      {
        index: 13,
        Istrue: false,
      },
      {
        index: 14,
        Istrue: false,
      },
      {
        index: 15,
        Istrue: false,
      },
      {
        index: 16,
        Istrue: false,
      },
      {
        index: 17,
        Istrue: false,
      },
      {
        index: 18,
        Istrue: false,
      },
      {
        index: 19,
        Istrue: false,
      },
      {
        index: 20,
        Istrue: false,
      },
      {
        index: 21,
        Istrue: false,
      },
      {
        index: 22,
        Istrue: false,
      },
      {
        index: 23,
        Istrue: false,
      },
      {
        index: 24,
        Istrue: false,
      },
      {
        index: 25,
        Istrue: false,
      },
      {
        index: 26,
        Istrue: false,
      },
      {
        index: 27,
        Istrue: false,
      },
      {
        index: 28,
        Istrue: false,
      },
      {
        index: 29,
        Istrue: false,
      },
      {
        index: 30,
        Istrue: false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var arr = that.data.arrs
    for (let i in arr){
      if (arr[i].Istrue == false){
        arr[i].index = "?"
      }
    }
    that.setData({
      arrs:arr
    })
  },

  select:function(e){
    let index = e.currentTarget.dataset.index
    if (index == '?'){
      wx.showToast({
        title: '关卡暂未开通',
        icon:'none',
        duration: 1000,
      })
    }else{
      wx.navigateTo({
        url: '../index/index?source=' + JSON.stringify(index),
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})