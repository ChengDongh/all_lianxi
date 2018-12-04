// pages/shop_cart/shop_cart.js
var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var wxpay = require('../../utils/wxpay.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
var app = getApp()
Page({
    data: {
        list: [],
        selectlist: [],
        delBtnWidth: 120, //删除按钮宽度单位（rpx）
        level: '',
        totalPrice: '',
        allSelect: false,
        hidden: true,
        sort: []
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
    onLoad: function() {
        var list = this.data.list
        var that = this
        this.initEleWidth();
        //this.onShow();
        wx.getStorage({
            key: 'user',
            success: function(res) {
                that.setData({
                    level: res.data.user_level //获得 level 等级
                })
            }
        })
    },
  onShow: function () {
        let  shopList = [];
        let that = this
        // 获取购物车数据
        var shopCarInfoMem = wx.getStorageSync('cartinfor');
        this.setData({
            list: shopCarInfoMem
        })
         this.ifallselect();
        // this.toPayOrder(shopCarInfoMem)
        this.countMoney(shopCarInfoMem)
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
                left = "margin-left:0px";
            } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
                if (disX >= delBtnWidth) {
                  left = "left:-" + delBtnWidth + "px";
                }else{
                  left = "margin-left:-" + disX + "px";
                }
            }
            var list = this.data.list;
            if (index !== "" && index != null) {
                list[index].left = left;
                this.setGoodsList(list)
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
            var list = this.data.list;
            if (index !== "" && index != null) {
                list[index].left = left;
                this.setGoodsList(list)
            }
        }
    },
    delItem: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        // var sort = this.data.sort;
        var that = this;
        // var selectlist = this.data.selectlist;
        list.splice(index, 1);
        //判断当前仓下面商品是否全部选择 
        this.countMoney(list)
        this.setGoodsList(list)
        this.allbtn()
    },
    selectTap: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        var that = this;
        if (index !== "" && index != null) {
            //当前商品为选中状态
            if (list[index].active) {
              list[index].active = false
                that.countMoney(list)
            } else {
              list[index].active = true
                that.countMoney(list)
            }
            //判断当前仓下面商品是否全部选择 
            this.ifallselect();
            this.setGoodsList(list)
            // this.allbtn() //全选按钮状态
        }

    },
    totalPrice: function() {
        var list = this.data.goodsList.list;
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (curItem.active) {
                total += parseFloat(curItem.price) * curItem.number;
            }
        }
        total = parseFloat(total.toFixed(2)); //js浮点计算bug，取两位小数精度
        return total;
    },
    ifallselect(){
      let tip = 1;
        let list =this.data.list;
      for (let i of list) {
        if (!i.active) {
          tip = 0;
          this.setData({
            allSelect: false
          })
          break;
        }
      }
      if (tip == 1) {
        this.setData({
          allSelect: true
        })
      }
    },
    setGoodsList: function(list) {
      this.setData({
        list: list
      });
        //所有的 left = 0 储存
        // for (var item in list) {
        //     if (typeof list[item] == 'object') {
        //         for (var i = 0; i < list[item].shop.length; i++) {
        //             list[item].shop[i].left = ''
        //         }
        //     }
        // }
        if (JSON.stringify(list) == "{}") {
            wx.removeStorage({
              key: 'cartinfor'
            })
            this.setData({
                list: ''
            });
        } else {
            wx.setStorage({
              key: "cartinfor",
                data: list
            })
        }
        //更新商品后 计算价格
        this.countMoney(list)
    },
    bindAllSelect: function() {
        var that = this
        var currentAllSelect = this.data.allSelect;
        var list = this.data.list;
        if (!currentAllSelect) {
            this.setData({
                allSelect: true
            });
            wx.setStorage({
                key: 'allSelect',
                data: true
            })
            for (var item in list) {
                list[item].select = true
            }
            //仓库全选状态
            that.selectStatus()
            //计算钱数
            that.countMoney(list)
        } else {
            this.setData({
                allSelect: false,
                selectlist: '',
                totalPrice: '',
                hidden: true
            });
            wx.setStorage({
                key: 'allSelect',
                data: false
            })
            //取消全选 所有要购买商品删除
            wx.removeStorage({
                key: 'selectlist'
            })
            for (var item in list) {
                list[item].select = false
            }
            //仓库全选状态
            that.selectStatus()
        }
    },
    jiaBtnTap: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        if (index !== "" && index != null) {
          list[index].num++;
                this.countMoney(list)
            this.setGoodsList(list)
        }
    },
    jianBtnTap: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        if (index !== "" && index != null) {
            list[index].num--;
              this.countMoney(list)
            this.setGoodsList(list)
        }
    },
    toPayOrder: function() {
        var hidden = this.data.hidden;
        var data = this.data.list;
        var selectArr = []
        var that = this
        for (var item in data) {
            if (typeof data[item] == 'object') {
                for (var i = 0; i < data[item].shop.length; i++) {
                    if (data[item].shop[i].active) {
                        var id = data[item].shop[i].product.id
                        if (!that.contains(selectArr, id)) {
                            selectArr.push(id)
                        }
                    }
                }
            }
        }
        // ktop.request({
        //     api: "kml.p.productdetails",
        //     data: {
        //         productIds: selectArr.toString()
        //     },
        //     loading: true,
        //     finish: function(res, code) {
        //         that.newproduct(res)
        //     }
        // })
    },
    /**
     *  更新商品
     */
    newproduct: function(data) {
        var list = this.data.list
        var ps = {}
        for (var i = 0; i < data.length; i++) {
            var sku = data[i].productStyleInfos[0].productSkuInfos
            for (var j = 0; j < sku.length; j++) {
                ps[sku[j].id] = sku[j]
            }
        }
        for (var item in list) {
            if (typeof list[item] == 'object') {
                for (var i = 0; i < list[item].shop.length; i++) {
                    for (var ids in ps) {
                        if (list[item].shop[i].skus.id == ids) {
                            var news = ps[list[item].shop[i].skus.id]
                            var old = list[item].shop[i].skus
                            if (news.available_inventory == 0 || news.onsale == 0 || news.delete_time > 0) {
                                list[item].shop.splice(i, 1)
                                if (list[item].shop.length == 0) {
                                    delete list[item]
                                }
                            } else {
                                ps[list[item].shop[i].skus.id].quantity = list[item].shop[i].skus.quantity
                                if (old.quantity > news.available_inventory) {
                                    news.quantity = news.available_inventory
                                } else {
                                    news.quantity = old.quantity
                                    list[item].shop[i].skus = news
                                }
                            }
                        }
                    }
                }
            }
        }
        this.setGoodsList(list)
    },
    navigateToPayOrder: function() {
        wx.hideLoading();
        wx.navigateTo({
            url: "/pages/placeorder/placeorder?fromid=1"
        })
    },
    goshopping: function() {
        wx.switchTab({
            url: '/pages/market/market'
        })
    },
    /**
     * 当前仓库下商品全选
     */
    warehouseSelect: function(e) {
        var index = e.currentTarget.dataset.index;
        var list = this.data.list;
        if (list[index].select) {
            //选中状态更改
            list[index].select = false
            for (var i = 0; i < list[index].shop.length; i++) {
                list[index].shop[i].active = false
            }
            //计算价格
            this.countMoney(list)
        } else {
            //选中状态更改
            list[index].select = true
            for (var i = 0; i < list[index].shop.length; i++) {
                list[index].shop[i].active = true
            }
            //计算价格
            this.countMoney(list)
        }

        this.setGoodsList(list)
        this.allbtn() //全选按钮状态
    },
    /**
     * 全选  选中状态
     */
    selectStatus: function(e) {
        var list = this.data.list;
        var status = this.data.allSelect;
        //所有的商品选中状态更改
        for (var item in list) {
            if (typeof list[item] == 'object') {
                for (var i = 0; i < list.length; i++) {
                    if (status) {
                        list[i].active = true
                    } else {
                        list[i].active = false
                    }
                }
            }
        }
        this.setGoodsList(list);
    },
    /**
     * 全选按钮 状态
     */
    allbtn: function() {
        var that = this
        var list = this.data.list;
        var sw = false
        for (var item in list) {
            if (list[item].select == false) {
                this.setData({
                    allSelect: false
                });
                wx.setStorage({
                    key: 'allSelect',
                    data: false
                })
                sw = true
                break
            }
            setTimeout(function() {
                if (!sw) {
                    that.setData({
                        allSelect: true
                    });
                    wx.setStorage({
                        key: 'allSelect',
                        data: true
                    })
                }

            }, 100)
        }
    },
    countMoney: function(data) {
        var level = this.data.level
        var totalprice = 0;
        var price;
        for (var item in data) {
           if(data[item].active)
           {
             totalprice = totalprice + data[item].num * data[item].sku.price;
           }
        }
        if (totalprice == 0) {
            this.setData({
                hidden: true
            })
        } else {
            this.setData({
                hidden: false,
                totalPrice: totalprice.toFixed(2)
            })
        }

    },
    /**
     * 判断数组中是否已存在
     */
    contains: function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    },
    /**
     * 下单前的分单
     */
    branch: function() {
        var hidden = this.data.hidden
        var data = this.data.list
        var order = [];
        // this.toPayOrder()
        for (let item=0;item< data.length;item++) {
            if (typeof data[item] == 'object') {
                    if (data[item].active) {
                      order.push(data[item]);
                      data.splice(item,1);
                      item--;
                        // if (data[item].shop[i].product.express_type == 1) {
                        //     if (order['w-' + data[item].shop[i].product.warehouse_id]) {
                        //         order['w-' + data[item].shop[i].product.warehouse_id].shop.push(data[item].shop[i])
                        //     } else {
                        //         order['w-' + data[item].shop[i].product.warehouse_id] = {}
                        //         order['w-' + data[item].shop[i].product.warehouse_id].key = data[item].shop[i].product.warehouse_id
                        //         order['w-' + data[item].shop[i].product.warehouse_id].title = data[item].shop[i].product.warehouseTitle
                        //         order['w-' + data[item].shop[i].product.warehouse_id].shop = []
                        //         order['w-' + data[item].shop[i].product.warehouse_id].shop.push(data[item].shop[i])
                        //     }
                        // } else {
                        //     if (order['p-' + data[item].shop[i].product.warehouse_id]) {
                        //         order['p-' + data[item].shop[i].product.warehouse_id].shop.push(data[item].shop[i])
                        //     } else {
                        //         order['p-' + data[item].shop[i].product.warehouse_id] = {}
                        //         order['p-' + data[item].shop[i].product.warehouse_id].key = data[item].shop[i].product.warehouse_id
                        //         order['p-' + data[item].shop[i].product.warehouse_id].title = data[item].shop[i].product.warehouseTitle
                        //         order['p-' + data[item].shop[i].product.warehouse_id].shop = []
                        //         order['p-' + data[item].shop[i].product.warehouse_id].shop.push(data[item].shop[i])
                        //     }
                        // }
                    }
                
            }
        }
        this.setData({
          list:data
        })
        wx.setStorageSync('cartinfor', data);
        wx.setStorage({
          key: 'orderinfor',
          data: order
        })
        this.navigateToPayOrder()
    }
})