var ktop = require('../../utils/ktop.js')
var utils = require('../../utils/util.js')

Page({
    data : {
        categoryId: 0,
        countryId : 0,
        brands : [],
        products : []
    },

    onLoad: function (options) {
        this.setData(typeof options.categoryId == "undefined" ? { categoryId : 0 } : { categoryId : options.categoryId })
        this.setData(typeof options.countryId == "undefined" ? { countryId : 0 } : { countryId : options.countryId })
        this.fetchBrands()
        this.fetchProducts(0)
        wx.setNavigationBarTitle({
          title: options.title,
          success: function(res) {
            // success
          }
        })
    },

    fetchBrands: function () {
        var that = this
        ktop.request({
            api: "kml.p.brand",
            loading: true,
            data: {
                categoryId: that.data.categoryId,
                countryId : that.data.countryId
            },
            finish: function (res, code) {
                that.setData({ brands : res })
            }
        })
    },

    fetchProducts: function (offset, callback) {
        var that = this
        ktop.request({
            api: "kml.p.products",
            loading: true,
            data: {
                categoryId: that.data.categoryId,
                countryId: that.data.countryId,
                limit: 10,
                offset: offset
            },
            finish: function (res, code) {
                callback && callback();          
                utils.removewebps(res, "country_url")
                if (offset == 0) {
                    that.setData({ products: res })
                } else {
                    that.setData({ products: that.data.products.concat(res) })
                }
            }
        })
    },

    onPullDownRefresh: function () {
        this.fetchBrands()
        this.fetchProducts(0,
            function () {
                wx.stopPullDownRefresh()
            }
        )
  },

    onReachBottom: function () {
        this.fetchProducts(this.data.products.length)
    },
})