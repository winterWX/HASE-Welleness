// pages/comment/friendActivity/friendActivity.js
Page({
  data: {
    imageList:[
      {src:'../../../image/testImage.jpg',name:'雄安',id:0},
      {src:'../../../image/testImage.jpg',name:'Shopli',id:1},
      {src:'../../../image/testImage.jpg',name:'王大锤',id:2},
      {src:'../../../image/testImage.jpg',name:'Shopli',id:3},
      {src:'../../../image/testImage.jpg',name:'winter',id:4},
      {src:'../../../image/testImage.jpg',name:'Shopli',id:5}
    ],
    myActiveFriendList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myActiveFriendData = JSON.parse(options.data);
    that.setData({
      myActiveFriendList: myActiveFriendData
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