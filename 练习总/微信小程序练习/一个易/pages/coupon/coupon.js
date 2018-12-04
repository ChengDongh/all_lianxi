var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js")
Page({
      data: {
        type: 0,
        nodes: [],
        fromplaceorder: false,
        source: [],
        select: null,
        addressid: null,
      },
      onLoad: function(options) {
        this.setData({
          fromplaceorder: options.fromplaceorder ? true : false
        })
        this.loadData()
      },
      exchangeHongbao: function() { //兑换优惠卷
        let that = this;
        wx.request({
          url: 'https://yiapi.qiqiangkeji.com/exchangeHongbao',
          method: 'post',
          data: {
            'openid': wx.getStorageSync('openid'),

          },
          success: function(res) {

            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function() {
                that.loadData();
              }
            })

          }
        })
      },
      loadData() {
        wx.showLoading({
          title:'加载中'
        })
        const that = this;
        const query = {
          openid: wx.getStorageSync('openid')
        }
        ktop.request({
          api: '/getUserHongbao',
          data: {
            openid: wx.getStorageSync('openid')
          },
          finish: function(res) {
            wx.hideLoading();
            if (res.code == 0) {
              let source = [];
              for (let i of res.data) {
                i.create_time = utils.formatTime(Number(i.create_time));
                if (i.finish_time !== "0")
                  i.finish_time = utils.formatTime(Number(i.finish_time));
                else
                  i.finish_time = '永久'
              }
              that.setData({
                source: res.data
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.msg,
              })
            }
          }
        })

   
  },
  home(e) {
    const product = e.currentTarget.dataset.product
    if (product) {
      wx.redirectTo({
        url: `/pages/product/product?id=${product.id}`,
      })
    } else {
      wx.switchTab({
        url: '/pages/market/market',
      })
    }
  },
  chooseCoupon(e) {
    if (this.data.fromplaceorder == true) {
      const ticket = e.currentTarget.dataset.ticket
      if (ticket.class !== 'cancel') {
        this.setData({
          select: e.currentTarget.dataset.index
        })
        WxNotificationCenter.postNotificationName("changecouponid", {
          couponid: ticket.id
        });
        // WxNotificationCenter.postNotificationName("expressChooseCoupon", ticket);
        // WxNotificationCenter.postNotificationName("fromid", this.data.fromid);
        // wx.navigateTo({
        //   url: '/pages/placeorder/placeorder?fromid=' + this.data.fromid + '&couponid=' + ticket.id,
        // })
        wx.navigateBack({
          delta: 1
        })
      }
      return
    } else {
      return
    }
  },
  nouse: function() {
    if (this.data.fromplaceorder == true) {
      WxNotificationCenter.postNotificationName("changecouponid", {
        couponid: null
      });
      wx.navigateBack({
        delta: 1
      })
    }

  },
  addNode(ticket, useproduct) {
    let node = []
    node.push({
      name: 'ul',
      attrs: {
        class: 'terms'
      },
      children: [{
          name: 'li',
          attrs: {
            class: 'term'
          },
          children: [{
            type: 'text',
            text: `满${ticket.min_price}元可用`
          }]
        },
        {
          name: 'li',
          attrs: {
            class: 'term'
          },
          children: [{
            type: 'text',
            text: `${utils.formatTime(Number(ticket.create_time))}至${utils.formatTime(Number(ticket.finish_time))}`
          }]
        },
        {
          name: 'li',
          attrs: {
            class: 'term'
          },
          children: [{
            type: 'text',
            text: useproduct
          }]
        }
      ]
    })
    return node;
  }
})