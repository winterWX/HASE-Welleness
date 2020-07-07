Page({
  data: {
     hideModal: true,     
     animationData: {},
     paceleNumber:'',
     canIUse: wx.canIUse('button.open-type.getUserInfo'),
     msgBox:true,
     veCode: new Array(),
     time: 0,
     msgContentBox:false,
     phoneSendParams:{},
     registerBtnNum: true,
     registerPhoneNum: false,
     registerPhoneUi:false
  },
  //在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad: function () {
    var that = this;
  },
  onshow: function (openid, userInfo, phoneNumber) {
    var that = this;
  },
  registerBtn:function(){
    var that = this;
    that.registerBtnFun();
  },
  registerPhone:function(){
    var that = this;
    that.setData({
      veCode :[]
    })
    that.registerBtnFun();
    that.setData({
      registerPhoneUi: true
    })
  },
  // 显示遮罩层========
  registerBtnFun: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();  //调用显示动画
    }, 100)
  },
  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100,  
      timingFunction: 'ease',  
    })
    this.animation = animation
    that.fadeDown();   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 100)  
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()  
    })
  },
  fadeDown: function () {
    this.animation.translateY(1000).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  closePage:function(){
    var that =this;
    that.fadeDown()
    that.setData({
       hideModal: true
    })
    that.setData({
      msgBox: true
    })    
    that.setData({
      msgContentBox: false
    })
  },
  bindKeyInput:function(e){
    var inputNameData = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(inputNameData))) {
      if (inputNameData.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'success',
          duration: 2000
        })
      }
    } else {
      this.setData({
        paceleNumber: inputNameData
       });
    }
  },
  sussesNumber:function(){
    var that = this;
    var mobileNumber = that.data.paceleNumber;
    wx.request({
     url: `http://106.54.73.125:8102/remote/mobile/bind/sendSms/${mobileNumber}`,
     method:"GET",
     header:{
       'Content-Type':'application/json'
     },
     success: function (res) {
        if(res.data.code === 200){
            that.setData({
              msgBox:false
            })
            that.setData({
              msgContentBox : true
            })
            that.setData({
              phoneSendParams : res.data.data 
            })
            that.setData({
              registerBtnNum : false
            })
            that.setData({
              registerPhoneNum : true
            })
            that.againTimeBtn();
       }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  inputValueFun(e) {
    var that = this;
    let value = e.detail.value;
    let arr = [...value];
    that.setData({ veCode: arr })
    if(that.data.veCode.length === 6){
       that.phoneNumberSendSuccess();
    }
  },
  againTime() {
    let time = this.data.time;
    clearInterval(timing);
    let timing = setInterval(() => {
      if (time <= 0) {
        clearInterval(timing)
      } else {
        time--;
        this.setData({
          time: time
        })
      }
    }, 1000)
  },
  againTimeBtn() {
    this.setData({ time: 60 });
    this.againTime()
  },
  phoneNumberSendSuccess:function(){
    var that = this;
    var mobileNumber = that.data.paceleNumber;
    var myPorFileId = wx.getStorageSync('myPorFileId');
    wx.request({
     url: 'http://106.54.73.125:8102/remote/mobile/bind',
     method:"POST",
     data:{
        code: that.data.phoneSendParams.code,
        id: myPorFileId +'',
        mobile: mobileNumber+'',
        time: that.data.phoneSendParams.time
     },
     header:{
       'Content-Type':'application/json'
     },
     success: function (res) {
        //if(res.data.code === 200){
           that.closePage();
           console.log('success1111111111')
        //}
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
})


