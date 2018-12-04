// pages/favorite/favorite.js
var ktop = require('../../utils/ktop.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    favoritelist: null,
    page: 1,
    delBtnWidth: 120
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getmyfeedback();
  },
  getmyfeedback: function() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    ktop.request({
      api: '/myfavorite',
      data: {
        openid: wx.getStorageSync('openid'),
        page: this.data.page
      },
      finish: function(res) {
        wx.hideLoading();
        if (res.code == 0) {
          let favoritelist = that.data.favoritelist;
          if (that.data.page == 1) {
            favoritelist = res.data.data;
          } else {
            favoritelist.push(...res.data);
          }
          that.setData({
            favoritelist
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
  onReachBottom: function() {
    this.setData({
      page: ++this.data.page
    })
    wx.showLoading({
      title: '记载中',
    })
    this.getmyfeedback();
  },
  shopping: function(e) {
    wx.navigateTo({
      url: '/pages/product/product?id=' + e.target.dataset.id,
    })
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
        left = "margin-left:0rpx";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "rpx";
        } else {
          left = "margin-left:-" + disX + "rpx";
        }
      }
      var list = this.data.favoritelist;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          favoritelist: list
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
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "rpx" : "margin-left:0rpx";
      var list = this.data.favoritelist;
      if (index !== "" && index != null) {
        list[index].left = left;
        this.setData({
          favoritelist: list
        })
      }
    }
  },
  delItem: function(e) {
    var index = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '删除收藏',
      content: '确定删除收藏吗?',
      success: function(res) {
        if (res.confirm) {
          ktop.request({
            api: '/favoriteDel',
            data: {
              openid: wx.getStorageSync('openid'),
              id: that.data.favoritelist[index].id
            },
            finish: function(res) {
              if (res.code == 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  success: function() {
                    that.getmyfeedback();
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
  },

})