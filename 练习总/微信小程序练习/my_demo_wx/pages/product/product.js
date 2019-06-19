// pages/product/product.js
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    current: 0,
    productId: 0,
    images_0: [],
    product: {},
    showcover: false,
    show: 1,
    pagesshow: 0,
    images: [],
    skuindex1: 0,
    skuindex2: 0,
    skuindex: 0,
    sku: [],
    inventory: 0,
    quantity: 1,
    cartbtn: ''
  },

  onShareAppMessage: function(res) { //分享
    return {
      title: this.data.product.title,
      desc: this.data.product.summary,
      path: '/pages/product/product?id=' + this.data.productId
    }
  },
  loadData: function() {
    var that = this;
    var productId = that.data.productId;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'http://hisin.natapp1.cc/product/details',
      method: 'POST',
      data: {
        openid: that.data.openid,
        id: productId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          let product = res.data.data.productSpu;
          var sku = res.data.data.productSku;
          product.param1s = res.data.data.param1s
          product.param2s = res.data.data.param2s ? res.data.data.param2s : ''
          var images_0 = product.imageBanner.split(',');
          var images = product.images.split(',');
          that.setData({
            product,
            images_0,
            images,
            sku
          })
          for (let i = 0; i < sku.length;i++){
            if (sku[i].inventory > 0) {
              let param1 = sku[i].param1;
              let param2 = sku[i].param2;
              let skuindex1 = res.data.data.param1s.map(item => item.title).indexOf(param1);
              let skuindex2 = res.data.data.param2s.map(item => item.title).indexOf(param2);
              that.setData({
                skuindex1,
                skuindex2
              })
              break;
            }
          }
          that.changesku();
          that.inventoryunm();
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
  //打开企业认证、店铺认证的滑块
  shopcover: function() {
    var showcover = this.data.showcover;
    this.setData({
      showcover: !showcover
    })

  },
  //商品详情和商品评价的切换
  pagechange: function(e) {
    var pagesshow = e.currentTarget.dataset.index;
    this.setData({
      pagesshow
    });
  },
  //点击记录点击的是加入购物车 还是立即购买
  buyProduct: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index,
      cartbtn: e.currentTarget.dataset.btn
    })
  },
  //关闭点击购物车或者立即购买弹出的滑块
  closecart: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index
    })
  },
  //商品数量的减
  minus: function() {
    let num = this.data.quantity;
    num--;
    this.setData({
      quantity: num
    })
  },
  //商品数量的加
  plus: function() {
    let num = this.data.quantity;
    num++;
    this.setData({
      quantity: num
    })
  },
  //点击（购物车或者立即购买之后出现的滑块)中的按钮
  placeorder: function(e) {
    var that = this;
    if (that.data.inventory != 0) {
      if (that.data.cartbtn == '加入购物车') { //点击加入购物车的按钮
        let carStorage = wx.getStorageSync('cartinfo');
        let cartinfo = {};
        cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
        cartinfo.sku = that.data.sku[that.data.skuindex];
        cartinfo.num = that.data.quantity;
        cartinfo.title = that.data.product.title;
        cartinfo.productId = that.data.productId;
        cartinfo.freight = that.data.product.freight;
        cartinfo.active = true;
        if (carStorage) { //存在购物车的缓存
          let a = 1;
          for (let i of carStorage) {
            if (i.sku.id == cartinfo.sku.id) { //判断是否有这个商品
              a = 2;
              i.num = i.num + cartinfo.num; //有这个商品 就数量加一
              break;
            }
          }
          if (a == 1) { //没有这个商品 就添加进去
            carStorage.push(cartinfo)
          }
          wx.setStorage({
            key: 'cartinfo',
            data: carStorage,
            success: function() {
              wx.showToast({
                title: '加入购物车',
                duration: 1000
              })
            }
          })
        } else { //如果不存在购物车的缓存 就新建购物车缓存 并将商品添加进去
          wx.setStorage({
            key: 'cartinfo',
            data: [cartinfo],
            success: function() {
              wx.showToast({
                title: '加入购物车',
                duration: 1000
              })
            }
          })
        }
      } else { //点击下一步按钮
        let cartinfo = {};
        cartinfo.image = that.data.product.param1s[that.data.skuindex1].image;
        cartinfo.sku = that.data.sku[that.data.skuindex];
        cartinfo.num = that.data.quantity;
        cartinfo.title = that.data.product.title;
        cartinfo.productId = that.data.productId;
        cartinfo.freight = that.data.product.freight;
        wx.setStorage({ //记录购买商品的信息 存入缓存中 供结算页面使用
          key: 'orderInfo',
          data: [cartinfo],
          success: function() {
            wx.navigateTo({
              url: '/pages/placeorder/palceorder',
            })
          }
        });
      }
      that.setData({
        show: 1
      })
    }else{
      wx.showToast({
        title: '没有库存了',
        icon:'none'
      })
    }

  },

  collection: function() { //收藏
    var that = this;
    var collectStorage = wx.getStorageSync('collectInfo'); //获取收藏的缓存
    var productId = that.data.productId;
    var collectInfo = {};
    collectInfo.productId = that.data.productId;
    collectInfo.title = that.data.product.title;
    collectInfo.price = that.data.product.price;
    collectInfo.image = that.data.product.param1s[0].image;
    if (collectStorage) { //如果有收藏的缓存 
      var collect_num = 0;
      for (let list of collectStorage) {
        if (list.productId == productId) { //判断该商品时候收藏过 收藏过就提示收藏
          collect_num = 1;
          wx.showToast({
            title: '已收藏过了',
            icon: 'none'
          })
        }
      }
      if (collect_num == 0) { //没有收藏的话 将其添加到收藏的缓存中去
        collectStorage.push(collectInfo);
        wx.setStorage({
          key: 'collectInfo',
          data: collectStorage,
          success: function() {
            wx.showToast({
              title: '收藏成功',
            })
          }
        })
      }
    } else { //如果没有收藏缓存 创建收藏缓存 将其存入缓存中
      wx.setStorage({
        key: 'collectInfo',
        data: [collectInfo],
        success: function() {
          wx.showToast({
            title: '收藏成功',
          })
        }
      })
    }
  },
  //点击主页按钮 返回主页
  gomarket: function() {
    wx.switchTab({
      url: '/pages/market/market',
    })
  },

  changeparam1: function(e) { //点击商品颜色来选择尺码
    this.setData({
      skuindex1: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku(); //获取库存
    this.inventoryunm(); //点击商品颜色来选择尺码的方法
  },

  changeparam2: function(e) { //点击商品尺码来选择颜色
    this.setData({
      skuindex2: e.currentTarget.dataset.index,
      quantity: 1
    });
    this.changesku(); //获取库存
    this.inventoryunm(); //点击商品颜色来选择尺码的方法
  },
  changesku: function() { //获取库存
    var that = this;
    console.log(that.data.skuindex1)
    let length = that.data.sku.length;
    for (let i = 0; i < length; i++) {
      if (that.data.sku[i].param1 == that.data.product.param1s[that.data.skuindex1].title) {
        if (that.data.skuindex2 != -1 && that.data.sku[i].param2.length > 0) {
          if (that.data.sku[i].param2 == that.data.product.param2s[that.data.skuindex2].title) {
            that.setData({
              skuindex: i,
              inventory: that.data.sku[i].inventory
            })
            break
          }
        } else {
          that.setData({
            skuindex: i,
            inventory: that.data.sku[i].inventory
          })
        }
      }
    }
  },

  inventoryunm: function() {
    var that = this;
    if (that.data.skuindex2 != -1 && that.data.product.param2s.length > 0) { //首次判断是否有尺码  （有尺码）
      for (let j = 0; j < that.data.product.param2s.length; j++) {
        let tip = 0;
        for (let i = 0; i < that.data.sku.length; i++) {
          if (that.data.sku[i].param1 == that.data.product.param1s[that.data.skuindex1].title && that.data.sku[i].param2 == that.data.product.param2s[j].title) { //通过颜色判断是否有尺码 有tip = 1
            tip = 1;
            if (that.data.sku[i].inventory <= 0) { //判断有尺码之后 判断尺码的库存还有没有
              that.data.product.param2s[j].disabled = 0;
            } else {
              that.data.product.param2s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          that.data.product.param2s[j].disabled = 0;
        }
      }
      for (let j = 0; j < that.data.product.param1s.length; j++) {
        let tip = 0;
        for (let i = 0; i < that.data.sku.length; i++) {
          if (that.data.sku[i].param2 == that.data.product.param2s[that.data.skuindex2].title && that.data.sku[i].param1 == that.data.product.param1s[j].title) { //通过尺码判断是否有颜色 有tip = 1
            tip = 1;
            if (that.data.sku[i].inventory <= 0) { //判断有颜色之后 判断颜色的库存还有没有
              that.data.product.param1s[j].disabled = 0; //没有库存了
            } else {
              that.data.product.param1s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          that.data.product.param1s[j].disabled = 0;
        }
      }
    } else { //没有尺码
      for (let i = 0; i < that.data.sku.length; i++) {
        if (that.data.sku[i].inventory <= 0) { //没有尺码的时候 判断颜色是否有库存
          that.data.product.param1s[i].disabled = 0;
        } else {
          that.data.product.param1s[i].disabled = 1;
        }
      }
    }
    that.setData({
      product: that.data.product
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      productId: options.id,
      openid: wx.getStorageSync('openid')
    });
    this.loadData()
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