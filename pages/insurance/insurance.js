const app = getApp()
Page({
  data: {
     openid: "",
     loginstate: "0",
     openid: "",
     userEntity: null,
     terminal: "",
     osVersion: "",
     phoneNumber: "",
     hideModal: true,       //模态框的状态  true-隐藏  false-显示
     animationData: {},
     userInfo:{},
     canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({ openid: res.data });
      },
      fail: function (res) {
        //that.getcode();
      }
    });
    wx.getStorage({
      key: 'userEntity',
      success: function (res) {
        that.setData({ userEntity: res.data });
      },
      fail: function (res) {
        console.log("fail1");
      }
    });
    wx.getStorage({
      key: 'loginstate',
      success: function (res) {
        that.setData({ loginstate: res.data });
      }, fail: function (res) {
        console.log("fail2");
      }
    });
  },
  onshow: function (openid, userInfo, phoneNumber) {
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ terminal: res.model });
        that.setData({ osVersion: res.system });
      }
    })
    wx.request({
      url: '',    //登录接口
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      //传值
      data: {
          username: phoneNumber,
          parentuser: 'xudeihai',
          wximg: userInfo.avatarUrl,
          nickname: userInfo.nickName,
          identity: "",
          terminal: that.data.terminal,
          osVersion: that.data.system,
          logintype: "10",//微信登录
          openid: that.data.openid,
      },
      success(res) {
        if (res.data.r == "T") {
          that.setData({ userEntity: res.data.d });
          wx.setStorage({
            key: "userEntity",
            data: res.data.d
          })
          that.setData({ loginstate: "1" });
          wx.setStorage({
            key: "loginstate",
            data: "1"
          })
          wx.setStorage({
            key: 'userinfo',
            data: "1"
          })
        }
        else {
          return;
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  //绑定手机
  getPhoneNumberData: function (e) {
    var that = this;
    wx.checkSession({
      success: function () {
        wx.login({
          success: res => {
            console.log('-=======',res.code);
            wx.request({
              url: '自己的登录接口',     //仅为示例，并非真实的接口地址
              data: {
                account: '1514382701',
                jscode: res.code
              },
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                if (res.data.r == "T") {
                  wx.setStorage({
                    key: "openid",
                    data: res.data.openid
                  })
                  wx.setStorage({
                    key: "sessionkey",
                    data: res.data.sessionkey
                  })
                  wx.setStorageSync("sessionkey", res.data.sessionkey);
                  wx.request({
                    url: '自己的解密接口',   //自己的解密地址
                    data: {
                      encryptedData: e.detail.encryptedData,
                      iv: e.detail.iv,
                      code: wx.getStorageSync("sessionkey")
                    },
                    method: "post",
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      if (res.data.r == "T") {
                        that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
                        console.log("登录成功")
                        console.log(res.data.d.phoneNumber)   //成功后打印微信手机号
                      }
                      else {
                        console.log(res);
                      }
                    }
                  })
                }
              }
            })
          }
        })
      },
      fail: function () {
        wx.login({
          success: res => {
            wx.request({
              url: '自己的登录接口',   //仅为示例，并非真实的接口地址
              data: {
                account: '1514382701',
                jscode: res.code
              },
              method: "POST",
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                if (res.data.r == "T") {
                  wx.setStorage({
                    key: "openid",
                    data: res.data.openid
                  })
                  wx.setStorage({
                    key: "sessionkey",
                    data: res.data.sessionkey
                  })
                  wx.request({
                    url: '自己的解密接口',//自己的解密地址
                    data: {
                      encryptedData: e.detail.encryptedData,
                      iv: e.detail.iv,
                      code: res.data.sessionkey
                    },
                    method: "post",
                    header: {
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  //一键授权时获取基本的信息
  getUserInfoData : function(){
    wx.getUserInfo({
      success: res => {
        console.log("resres===res",res);
        this.setData({
          userInfo: res.userInfo
        })
      }
    })
  },
  // 显示遮罩层=====================================
  getShowModal: function () {
    var that = this;
    wx.hideTabBar();
    that.getUserInfoData();
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 100,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
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
      duration: 100,  //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',  //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 100)  //先执行下滑动画，再隐藏模块
    wx.showTabBar();
  },
  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()  //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  }
})
