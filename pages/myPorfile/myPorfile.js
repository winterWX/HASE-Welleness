// pages/five/five.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     baseUrl:'http://106.54.73.125:8102',
     myProfileObject:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
        var that = this;
        wx.request({
          url:'http://106.54.73.125:8102/remote/myProfile/search?uid=1',
          method:'GET',
          header:{
            'Content-Type':'application/json'
          },
          success: function (res) {
              var resData = res.data.data;
              if(resData !== null){
                that.setData({
                   myProfileObject: resData 
                })
                wx.setStorage({
                  key: 'myPorFileId',
                  data: resData.id   //存第三条数据
                })
              }
          },
          fail: function (res) {
            console.log('.........fail000..........');
          }
        })
  },
  collectArticleTo:function (params) {
      wx.navigateTo({
        url: '../comment/collectArticle/collectArticle'
      })
  },
  myExsertive:function (params) {
    wx.navigateTo({
      url: '../comment/myExercise/myExercise'
    })
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