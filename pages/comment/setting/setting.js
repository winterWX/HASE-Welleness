// pages/comment/speeds/speeds.js
Page({
  data: {
    boxShare:false,
    clearSrogt:false,
    opuetion:false,
    defuleData:'138M'
  },
  onLoad: function () {
  },
  //设置页面的退出
  logOut:function(){
    var that= this;
    that.setData({
      boxShare: true
    })
    that.setData({
      opuetion:true
    })
  },
  canlenBox:function(){
    var that= this;
    that.closeBoxOrOption();
  },
  backBox:function(){
    var that = this;
    wx.switchTab({
      url: '../../myPorfile/myPorfile',
    })
    that.closeBoxOrOption();
  },
  clearStorgeData:function() {
    var that = this;
    that.setData({
       clearSrogt:true
    })
    that.setData({
      opuetion:true
   })
  },
  canlenClear:function() {
    var that= this;
    that.setData({
      clearSrogt: false
    })
    that.setData({
      opuetion: false
    })
  },
  comfirmClear:function(){
    var that= this;
    that.setData({
      clearSrogt: false
    })
    that.setData({
      opuetion: false
    })
    that.setData({
      defuleData:'0KB'
    })
  },
  accoutBar:function(){
     wx.navigateTo({
       url: '../accountSecurity/accountSecurity',
     })
  },
  pushSetting:function(){
    wx.navigateTo({
      url: '../pushSetting/pushSetting',
    })
  },
  closeBoxOrOption:function(){
     var that= this;
      that.setData({
        boxShare: false
      })
      that.setData({
        opuetion: false
      })
  }
})