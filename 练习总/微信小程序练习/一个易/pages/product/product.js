var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
Page({
  data: {
    productId: 0,
    current: 0,
    userLevel: 1,
    product: null,
    postfee: null,
    imgs: null,
    shopCarMap: null,
    sort: [],
    quantity: 1,
    images: [],
    sku: [],
    active: 0,
    pageshow: 0, //商品详情和评价切换
    show: 1, //cart是否显示，
    cartbtn: '',
    selectsku: '',
    skuindex1: 0,
    skuindex2: 0,
    skuindex: 0, //sku的下标,
    inventory: 0,
    time: null, //倒计时时间,
    productAppraise: null, //商品评价
    page: 1, //评论的分页,
    showcover:false

  },
  onShareAppMessage: function(res) {
    return {
      title: this.data.product.title,
      desc: this.data.product.summary,
      path: '/pages/product/product?id=' + this.data.productId
    }
  },
  shopcover:function(){
    let showcover = this.data.showcover;
    this.setData({
      showcover: !showcover
    })
  },
  onLoad: function(options) {
    var that = this
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        that.setData({
          shopCarMap: res.data
        })
      },
      fail: function() {
        that.setData({
          shopCarMap: {}
        })
      }
    })
    wx.getStorage({
      key: 'sort',
      success: function(res) {
        that.setData({
          sort: res.data
        })
      }
    })
    var productId = options.id
    var app = getApp()
    var userLevel = app.user.user_level
    this.setData({
      productId: productId,
      userLevel: userLevel
    })
    this.loadData();
  },
  onPullDownRefresh: function() {
    this.loadData(
      function() {
        wx.stopPullDownRefresh()
      }
    )
  },
  onShow: function() {
    /*var app = getApp()
    if (app.user.id) {
      if (this.data.products && this.data.products.length == 0) {
        this.loadData()
      }
    } else {
      wx.redirectTo({
        url: '/pages/welcome/welcome'
      })
    }*/
  },
  pagechange: function(e) {
    let that = this;
    this.setData({
      pageshow: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 1 && !this.data.productAppraise) {
      this.getproductAppraise();
    }
  },
  getproductAppraise: function() {
    let that = this;
    ktop.request({
      api: '/productAppraise',
      data: {
        openid: wx.getStorageSync('openid'),
        product_id: this.data.productId,
        page: this.data.page
      },
      finish: function(res) {
        if (res.code == 0) {
          for (let i of res.data.data) {
            i.create_time = utils.formatTime(i.create_time, 1);
            i.appraise_images = i.appraise_images.split(',');
          }
          let productAppraise = that.data.productAppraise;
          if (that.data.page == 1) {
            productAppraise = res.data.data;
          } else {
            productAppraise.push(...res.data.data);
          }
          that.setData({
            productAppraise: productAppraise
          })
        }
      }
    })
  },
  onReachBottom: function() {
    if (this.data.pageshow == 1 && this.data.productAppraise) {
      this.setData({
        page: ++this.data.page
      })
      this.getproductAppraise();
    }
  },
  collection: function() { //收藏商品
    ktop.request({
      api: '/favorite',
      data: {
        openid: wx.getStorageSync('openid'),
        spu_id: this.data.productId
      },
      finish: function(res) {
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: res.msg,
            icon: 'success'
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
  loadData: function(callback) {
    var that = this;
    let productId = this.data.productId;
    ktop.request({
      api: "/productWXDetail",
      data: {
        product_id: productId,
        openid: wx.getStorageSync('openid')
      },
      finish: function(res, code) {
        console.log(res)
        if (callback) {
          callback()
        }
        let product = res.data;
        const images = product.images.split(',');
        const images0 = product.images0.split(',');
        const sku = product.sku;
        const active = sku[0].id;
        const selectsku = sku[0];
        product.price = sku[0].price;
        product.num = sku[0].inventory;
        product.pre_price = sku[0].pre_price;
        product.skuId = sku[0].id;
        product.nownumber = sku[0].now_number;
        that.setData({
          product,
          images,
          sku,
          active,
          selectsku,
          images0,
        })
        if (res.data.badge && res.data.badge.title == '限时特价' ){
          that.settime(res.data.badge.end_time, new Date().getTime() / 1000);
        }
        let length = sku.length;
        for (let i = 0; i < length; i++) {
          if (sku[i].inventory > 0) {
            let param1 = sku[i].param1;
            let param2 = sku[i].param2;
            let skuindex1 = product.param1s.map(item => item.title).indexOf(param1);
            let skuindex2 = product.param2s.map(item => item.title).indexOf(param2);
            that.setData({
              skuindex1,
              skuindex2
            })
            break;
          }
        }
        that.changesku();
        that.inventoryunm();
      }
    })
  },
  settime: function(times, times2) { //设置倒计时时间
    let that = this;
    var timer = null;
    let time;
    let times3 = times - times2;
    timer = setInterval(function() {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0; //时间默认值
      if (times3 > 0) {
        day = Math.floor(times3 / (60 * 60 * 24)) > 0 ? Math.floor(times3 / (60 * 60 * 24)) : 0;
        hour = Math.floor((times3 / 3600)) - (day * 24) > 1 ? Math.floor((times3 / 3600)) - (day * 24) : 0;
        minute = Math.floor(times3 / 60) - (day * 24 * 60) - (hour * 60) > 1 ? Math.floor(times3 / 60) - (day * 24 * 60) - (hour * 60) : 0;
        second = Math.floor(times3) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        time = {
          day,
          hour,
          minute,
          second
        };
      } else {
        clearInterval(timer);
        time = 'end';
      }
      that.setData({
        time
      })
      times3--;
    }, 1000);

  },
  changeparam1: function(e) { //点击切换参数一
    this.setData({
      skuindex1: e.currentTarget.dataset.index,
      quantity: 1
    })
    this.changesku();
    this.inventoryunm();
  },
  changeparam2: function(e) { //点击切换参数二
    this.setData({
      skuindex2: e.currentTarget.dataset.index,
      quantity: 1
    })
    this.changesku();
    this.inventoryunm();
  },
  changesku: function() { //根据参数一和参数二获取sku
    let length = this.data.sku.length;
    for (let i = 0; i < length; i++) {
      if (this.data.sku[i].param1 == this.data.product.param1s[this.data.skuindex1].title) {
        if (this.data.skuindex2 != -1) {
          if (this.data.sku[i].param2 == this.data.product.param2s[this.data.skuindex2].title) {
            this.setData({
              skuindex: i,
              inventory: this.data.sku[i].inventory
            })
            break;
          }
        } else {
          this.setData({
            skuindex: i,
            inventory: this.data.sku[i].inventory
          })
          break;
        }


      }
    }
  },
  inventoryunm: function() { //根据库存数量显示按钮
    let product = this.data.product;
    let param1s = product.param1s;
    let param2s = product.param2s;
    let length = this.data.sku.length;
    let param1 = param1s[this.data.skuindex1].title;
    let sku = this.data.sku;
    if (this.data.skuindex2 != -1) {
      let param2 = param2s[this.data.skuindex2].title;
      for (let j = 0; j < param2s.length; j++) {
        let tip = 0;
        for (let i = 0; i < length; i++) {
          if (sku[i].param1 == param1 && sku[i].param2 == param2s[j].title) {
            tip = 1;
            if (sku[i].inventory <= 0) {
              param2s[j].disabled = 0; //没有库存了
            } else {
              param2s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          param2s[j].disabled = 0;
        }
      }
      for (let j = 0; j < param1s.length; j++) {
        let tip = 0;
        for (let i = 0; i < length; i++) {
          if (sku[i].param2 == param2 && sku[i].param1 == param1s[j].title) {
            tip = 1;
            if (sku[i].inventory <= 0) {
              param1s[j].disabled = 0; //没有库存了
            } else {
              param1s[j].disabled = 1;
            }
            break;
          }
        }
        if (tip == 0) {
          param1s[j].disabled = 0;
        }
      }
    } else {
      for (let i = 0; i < length; i++) {
        if (sku[i].inventory <= 0) {
          param1s[i].disabled = 0;
        } else {
          param1s[i].disabled = 1;
        }
      }
    }
    this.setData({
      product: product
    })
  },
  setup: function(product) {
    utils.removewebps(product.productImagesInfo, "image_url")
    var fStyle = product.productStyleInfos[0]
    var fSku = fStyle.productSkuInfos[0]
    var newcomer = {
      minPrice: fSku.newcomer_price,
      maxPrice: fSku.newcomer_price
    }
    var third_level = {
      minPrice: fSku.third_level_price,
      maxPrice: fSku.third_level_price
    }
    var propose = {
      minPrice: fSku.propose_price,
      maxPrice: fSku.propose_price
    }
    for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      style.styleImage = utils.removewebp(style.styleImage)
      if (i == 0) {
        product.current_image = style.styleImage
      }
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (newcomer.minPrice > sku.newcomer_price) {
          newcomer.minPrice = sku.newcomer_price
        } else if (newcomer.maxPrice < sku.newcomer_price) {
          newcomer.maxPrice = sku.newcomer_price
        }
        if (third_level.minPrice > sku.third_level_price) {
          third_level.minPrice = sku.third_level_price
        } else if (third_level.maxPrice < sku.third_level_price) {
          third_level.maxPrice = sku.third_level_price
        }
        if (propose.minPrice > sku.propose_price) {
          propose.minPrice = sku.propose_price;
        } else if (propose.maxPrice < sku.propose_price) {
          propose.maxPrice = sku.propose_price
        }
      }
    }
    product.newcomer = newcomer;
    product.third_level = third_level;
    product.propose = propose;
    this.makePrice(newcomer)
    this.makePrice(third_level)
    this.makePrice(propose)
    var user_level = this.data.userLevel
    if (user_level == 4) {
      product.current_level = product.third_level
      product.levelImg = "../../resource/image/user_level_4.png"
    } else {
      product.current_level = product.newcomer
      product.levelImg = "../../resource/image/user_level_1.png"
    }
    product.simpleProductServiceInfo = product.productServiceInfo.slice(0, 3)
    var allProductAttributeInfos = []
    if (product.country_title) {
      allProductAttributeInfos.push({
        title: "原产地",
        value: product.country_title
      })
    }
    var styleStr = product.productStyles.join(",")
    if (styleStr) {
      allProductAttributeInfos.push({
        title: "款式",
        value: styleStr
      })
    }
    var sizeStr = product.productSizes.join(",")
    if (sizeStr) {
      allProductAttributeInfos.push({
        title: "规格",
        value: sizeStr
      })
    }
    product.allProductAttributeInfos = allProductAttributeInfos.concat(product.productAttributeInfos)
    var app = getApp()
    var user_level = app.user.user_level
    var quantity = 0
    if (product.productStyleInfos.length == 1 && product.productStyleInfos[0].productSkuInfos.length == 1 && product.productStyleInfos[0].productSkuInfos[0].available_inventory > 0) {
      quantity = 1
    }
    for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (sku.style_title == '商品图') {
          sku.style_title = ""
        }
        sku.quantity = quantity
        if (user_level == 4) {
          sku.current_level_price = sku.third_level_price
        } else {
          sku.current_level_price = sku.newcomer_price
        }
      }
    }

  },
  makePrice: function(level) {
    if (level.minPrice == level.maxPrice) {
      level.price = level.minPrice;
    } else {
      level.price = level.minPrice + "~" + level.maxPrice
    }
  },
  tapImage: function(e) {
    var urls = []
    var index = this.data.current
    var currentUrl = ""
    for (var i = 0; i < this.data.product.productImagesInfo.length; i++) {
      var info = this.data.product.productImagesInfo[i];
      urls.push(info.image_url)
      if (index == i) {
        currentUrl = info.image_url
      }
    }
    wx.previewImage({
      current: currentUrl,
      urls: urls
    })
  },
  swiperchange: function(e) {
    var current = e.detail.current;
    this.setData({
      current: current
    })
    var volsLength = this.data.product.productImagesInfo.length
    if (current === volsLength) {
      this.setData({
        current: volsLength
      })
      wx.navigateTo({
        url: '/pages/forward/forward?id=' + this.data.productId + "&summary=" + this.data.product.summary,
        success: () => {
          this.setData({
            current: volsLength - 1
          })
        }
      })
    }
  },
  // showDeliveryTip: function() {
  //   if (this.data.postfee) {
  //     this.setData({
  //       delivery_notice: true
  //     })
  //   } else {
  //     var that = this
  //     ktop.request({
  //       api: "kml.p.postfeeAll",
  //       data: {
  //         productId: that.data.productId
  //       },
  //       loading: true,
  //       finish: function(res, code) {
  //         if (!res || !res.defaultExpressInfo) {
  //           return
  //         }
  //         that.genexpressStr(res.defaultExpressInfo.expressInfo)
  //         for (var i = 0; i < res.specificExpressInfos.length; i++) {
  //           var info = res.specificExpressInfos[i]
  //           that.genexpressStr(info.expressInfo)
  //         }
  //         that.setData({
  //           postfee: res,
  //           delivery_notice: true
  //         })
  //       }
  //     })
  //   }
  // },
  genexpressStr: function(info) {
    var str = ""
    var unit = info.express_charge_unit ? info.express_charge_unit : "件"
    if (info.increase_quantity > 0 && info.increase_price > 0) {
      str += info.default_quantity + unit + "以内"
      var price = "包邮"
      if (info.default_price > 0) {
        price = info.default_price + "元"
      }
      str += price
      str += "，之后每增加" + info.increase_quantity + unit
      str += "，运费增加" + info.increase_price + "元"
    } else {
      if (info.default_price > 0) {
        str = "邮费:" + info.default_price + "元"
      } else {
        str = "包邮"
      }
    }
    info.expressStr = str
  },
  deliveryHide: function() {
    this.setData({
      delivery_notice: false
    })
  },
  showService: function() {
    this.setData({
      service_notice: true
    })
  },
  serviceHide: function() {
    this.setData({
      service_notice: false
    })
  },
  shopCarCancel: function() {
    this.setData({
      cart: false
    })
  },
  buyProduct: function(e) {
    this.setData({
      show: e.currentTarget.dataset.index,
      cartbtn: e.currentTarget.dataset.btn
    })



    // const product = this.data.product
    // var app = getApp()
    // app.product = product
    // wx.navigateTo({
    //   url: '/pages/placeorder/placeorder'
    // })
    /*this.setData({
      cart: true
    })*/
  },
  placeorder: function() {
    var sku = this.data.sku;
    var canbuy = false;
    let product = this.data.product;
    let skuindex1 = this.data.skuindex1;
    let skuindex2 = this.data.skuindex2;
    let selectsku = sku[this.data.skuindex];
    let productId = this.data.productId;
    if (this.data.cartbtn == '下一步') {
      let buyinfor = {};
      buyinfor.image = product.param1s[skuindex1].image;
      buyinfor.sku = selectsku;
      buyinfor.num = this.data.quantity;
      buyinfor.title = product.title;
      buyinfor.productId = productId;
      wx.setStorageSync('buyinfor', buyinfor);
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?fromid=0'
      })
    } else {
      let cartinfor = {};
      let value = wx.getStorageSync('cartinfor');
      cartinfor.image = product.param1s[skuindex1].image;
      cartinfor.sku = selectsku;
      cartinfor.num = this.data.quantity;
      cartinfor.title = product.title;
      cartinfor.productId = productId;
      if (value) {
        let a = 1;
        for (let i of value) {
          if (i.sku.id == cartinfor.sku.id) {
            i.num = i.num + cartinfor.num;
            a = 2;
            break;
          }
        }
        if (a == 1) {
          value.push(cartinfor);
        }
        wx.setStorage({
          key: 'cartinfor',
          data: value,
          success: function() {
            wx.showToast({
              title: '加入购物车成功!',
              duration: 1000
            })
          }
        });
      } else {
        wx.setStorage({
          key: 'cartinfor',
          data: [cartinfor],
          success: function() {
            wx.showModal({
              title: '提示',
              content: '加入购物车成功！',
            })
          }
        });
      }
      this.setData({
        show: 1
      })
    }



    /*for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (sku.quantity > 0) {
          canbuy = true
          break
        }
      }
    }*/
    /*if (!canbuy) {
      wx.showToast({
        title: '请选择商品',
        icon: 'loading'
      })
      return;
    }*/
    // this.setData({
    //   cart: false
    // })
    // var app = getApp()
    // app.product = this.data.product
    // wx.redirectTo({
    //   url: '/pages/placeorder/placeorder'
    // })
  },
  forwardProduct: function() {
    wx.navigateTo({
      url: '/pages/forward/forward?id=' + this.data.productId + "&summary=" + this.data.product.summary
    })
  },
  minus: function(e) {
    let num = Number(this.data.quantity);
    num--;
    this.setData({
      quantity: num,
    })

  },
  plus: function(e) {
    let num = Number(this.data.quantity);
    num++;
    this.setData({
      quantity: num,
    })

  },
  inputQuantity: function(e) {
    var dataset = e.target.dataset
    var sku = dataset.sku
    var style = dataset.style
    var num = e.detail.value
    if (!num || num.length == 0) {
      sku.quantity = 0;
    } else {
      var q = parseInt(num)
      if (q < 0) {
        q = 0
      } else if (q > sku.available_inventory) {
        q = sku.available_inventory
      }
      sku.quantity = q
    }
    this.refreshStyle(style, 1)
    this.refreshSku(sku)
  },
  refreshSku: function(msku) {
    var product = this.data.product
    for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (sku.id == msku.id) {
          style.productSkuInfos[j] = msku
          this.setData({
            product: product
          })
          return;
        }
      }
    }
  },
  refreshStyle: function(style, refresh) {
    this.data.product.current_image = style.styleImage
    if (refresh != 1) {
      this.setData({
        product: this.data.product
      })
    }
  },
  styleTap: function(e) {
    var style = e.target.dataset.style
    this.refreshStyle(style)
  },
  imageLoad: function(e) {
    var idx = e.target.dataset.idx
    var imgs = this.data.imgs
    var item = imgs[idx]
    var imageHeight = utils.imageUtil(e)
    item.imageheight = imageHeight
    this.setData({
      imgs: imgs
    })
  },

  addcart: function() {
    var that = this
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        that.update()
      },
      fail: function() {
        that.bulidShopCarInfo()
      }
    })
  },
  skus: function() {
    var product = this.data.product
    var canbuy = false
    var upsku = []
    for (var i = 0; i < product.productStyleInfos.length; i++) {
      var style = product.productStyleInfos[i]
      for (var j = 0; j < style.productSkuInfos.length; j++) {
        var sku = style.productSkuInfos[j]
        if (sku.quantity > 0) {
          canbuy = true
          upsku.push(sku)
        }
      }
    }
    if (!canbuy) {
      wx.showToast({
        title: '请选择商品',
        icon: 'loading'
      })
      return;
    }
    return upsku;
  },
  /**
   * 创建购物车对象
   */
  bulidShopCarInfo: function(e) {
    var product = this.data.product
    var sort = this.data.sort
    var upsku = this.skus()
    var shopCarMap = this.data.shopCarMap || {};
    if (!upsku) {
      return
    }
    this.setData({
      cart: false
    })
    var store = [];
    for (var i = 0; i < upsku.length; i++) {
      var shop = {};
      shop.product = product
      shop.skus = upsku[i]
      shop.maxNum = upsku[i].available_inventory
      shop.quantity = upsku[i].quantity
      shop.left = ""
      shop.active = false
      shop.key = product.warehouse_id
      shop.img = product.productStyleInfos[0].styleImage
      store.push(shop)
    }
    var data = {
      select: false,
      warehouseTitle: product.warehouseTitle,
      shop: store
    }
    shopCarMap[product.warehouse_id] = data;
    sort.unshift(product.warehouse_id)
    wx.setStorage({
      key: 'allSelect',
      data: false
    })
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarMap,
      success: function() {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
      }
    })
    wx.setStorage({
      key: 'sort',
      data: sort
    })
  },
  /**
   * 更新商品
   */
  update: function() {
    var that = this;
    var product = this.data.product
    var upsku = this.skus()
    if (!upsku) {
      return
    }
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        var data = res.data
        //如果存在当前仓库
        if (data[product.warehouse_id]) {
          for (var i = 0; i < data[product.warehouse_id].shop.length; i++) {
            for (var j = 0; j < upsku.length; j++) {
              //如果存在商品 数量+1
              if (upsku[j].id == data[product.warehouse_id].shop[i].skus.id) {
                if (data[product.warehouse_id].shop[i].skus.quantity < data[product.warehouse_id].shop[i].skus.available_inventory) {
                  data[product.warehouse_id].shop[i].skus.quantity += upsku[j].quantity
                  //sku减去已有的
                  upsku.splice(j, 1)
                  break;
                } else {
                  upsku.splice(j, 1)
                  break;
                }
              }
            }
          }
          // 仓库全选
          //如果不存在商品 加上商品
          if (upsku) {
            for (var i = 0; i < upsku.length; i++) {
              var shop = {};
              shop.product = product
              shop.skus = upsku[i]
              shop.maxNum = upsku[i].available_inventory
              shop.quantity = upsku[i].quantity
              shop.left = ""
              shop.active = false
              shop.key = product.warehouse_id
              shop.img = product.productStyleInfos[0].styleImage
              data[product.warehouse_id].shop.unshift(shop)
              data[product.warehouse_id].select = false
            }
            wx.setStorage({
              key: 'allSelect',
              data: false
            })
          }
          that.setData({
            cart: false
          })
          wx.setStorage({
            key: 'shopCarInfo',
            data: data,
            success: function() {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'success'
              })
            }
          })
        } else {
          that.bulidShopCarInfo()
        }
      }
    })
  },
  chooseSku(e) {
    const sku = e.currentTarget.dataset.sku
    let product = this.data.product;
    product.price = sku.price;
    product.num = sku.inventory;
    product.pre_price = sku.pre_price;
    product.skuId = sku.id
    const active = sku.id;
    this.setData({
      product,
      active
    })
  },
  gomarket:function(){
   wx.switchTab({
     url: '/pages/market/market',
   })
  }
})