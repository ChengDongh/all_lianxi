// pages/market/market.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    page: 1,
    hotSearch: [],
    category_id: 0,
    title: '',
    banners: [],
    products: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var that = this;
    app.getOpenid().then(function(res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid')
        })
        that.loadData();
        that.getHotSearch();
        that.getBanner();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    })
  },
  // 搜索
  hotSearcht: function (e) {
    let category_id = 0;
    this.setData({
      page: 1,
      title: e.detail.value,
      category_id,
      products:[]
    })
    this.loadData();
  },
  //头部导航条
  getHotSearch: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'http://hisin.natapp1.cc/product/category',
      method: 'POST',
      data: {
        openid: this.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            hotSearch: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  hotSearch(e) {
    let category_id = 0;
    let title = '';
    category_id = e.currentTarget.dataset.key.id;
    this.setData({
      category_id,
      page:1,
      title:'',
      products: []
    })
    this.loadData();
  },
  // 获取banner
  getBanner: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'http://hisin.natapp1.cc/banner/all',
      method: 'POST',
      data: {
        openid: this.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            banners: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  // 商品列表
  loadData: function() {
    var that = this;
    var products = that.data.products;
    wx.showLoading({
      title: '加载中',
    });
    wx.stopPullDownRefresh();
    wx.request({
      url: 'http://hisin.natapp1.cc/product/search',
      method: 'POST',
      data: {
        page: this.data.page,
        openid: this.data.openid,
        categoryId: this.data.category_id,
        title: this.data.title
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if(res.data.code == 200){
          products.push(...res.data.data);
          that.setData({
            products: products
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function() {

  // },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {

  // },

  /**
   * 生命周期函数--监听页面隐藏
   */
  // onHide: function() {

  // },

  /**
   * 生命周期函数--监听页面卸载
   */
  // onUnload: function() {

  // },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      products: [],
      page:1,
      title:'',
    });
    this.loadData();
    this.getHotSearch();
    this.getBanner();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var page = this.data.page + 1;
    this.setData({
      page
    })
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: '转发时显示的标题',
      path: '转发的页面路径',
      success: res => {
        console.log('--- 转发回调 ---', res);

        //onShareAppMessage回调的shareTickets，如果没有，就说明不是转发到群聊的
        console.log('--- shareTickets ---', res.shareTickets);
        wx.showToast({
          title: res,
        })
        //转发到群里的才会有shareTickets
        if (res.shareTickets && res.shareTickets[0]) {

          //获取转发的详细信息
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: res => {
              console.log('--- 错误信息 ---', res.errMsg);
              console.log('--- 包括敏感数据在内的完整转发信息的加密数据 ---', res.encryptedData);
              console.log('--- 错误信息 ---', res.iv);
            },
            fail: error => {
              console.log('--- getShareInfo fail ---', error);
            }
          })
        }
      },
      fail: () => {
        console.log('--- 转发失败 ---', path);
      }
    }
  }
})