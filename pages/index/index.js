Page({
  data: {
    listData:[],
    timeData:[],
    inputSearchData:'',
    tabCur: 0, //默认选中
    tabLists: [],
    collectFlg:false,
    hideModal: true,     //模态框的状态  true-隐藏  false-显示
    animationData: {},
    myTagData:[],
    forYouData:[],
    editSwith: true,
    editStute: false,
    dataItemTag :[],
    researchTag:'',
    statusTy:[],
    topTitleIndex:-1,
    articleAdd: false,
    selectCollData:[],
    deleteTagArray:[],
    addTagArray:[],
    listId:[]
  },
  onLoad: function (options) {
     var that = this;
     that.tagsShareSearch();
     that.forYouSearchTag();
     that.searchSend('tabarNum');
  },
  bindKeyInput: function(e){
    var inputNameData = e.detail.value
    this.setData({
        inputSearchData: inputNameData
     });
  },
  //选择条目
  tabSelect(e) {
      var that = this;
      that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 2) * 200
      })
      that.setData({
         researchTag: that.data.tabLists[e.currentTarget.dataset.id].tag
      })
      that.searchSend('flg');
  },
  listClick(e){
    var goodsId = e.currentTarget.dataset.itemid;      
    wx.navigateTo({                                 
      url: '../comment/details/details?goodsId='+ goodsId      
    })
  },
  searchSend(parase){
    var that = this;
    var inputVal = this.data.inputSearchData.replace(/^\s+|\s+$/g,"");
    var researchVal = ''
    if(parase === 'tabarNum') {
        researchVal =  that.tabLists.length ===0 ? '':  that.tabLists[0].tag;
    } else if(parase==='flg'){
       researchVal = that.data.researchTag;
    }else{
       researchVal = inputVal;
    }
    wx.request({
     url:'http://106.54.73.125:8101/remote/article/list',
     data:{
       currentPage:'1',
       pageSize:'1000',
       research: researchVal,
       status:1,
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
          that.collectionQueryCounts();  // 赋值前调用
          res.data.data.forEach((item)=>{
              item.isCollect = false;
          })
          that.setData({
              listData: res.data.data
          });
          let timeAllData=[];
          res.data.data.forEach((item)=>{
           timeAllData.push(that.timestampToTime(item.createTime));
           that.setData({
             timeData: timeAllData
           })
         })
       }else{
          that.setData({
            listData: []
          });
       }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  collectionImageShare:function(e){
      var that = this;
      var articleId = e.currentTarget.dataset.id;
      var node = that.data.listData.findIndex(item=>{
         return item.id === articleId
      })
      if(node >-1){
          that.setData({
            topTitleIndex : node
          })
      }
      if(!that.data.listData[node].isCollect){
        that.collectionAdd(articleId);
      }else{
        that.collectionDetele(articleId);
      }
  },
  editActList:function(){
    var that= this;
    that.setData({
      editStute: true
    })
    that.setData({
      editSwith: false
    })
  },
  canlenBtn:function () {
    var that = this;
    that.setData({
      editStute: false
    })
  },
  confirmBtn:function() {
    var that = this;
    var listParas =[];
    that.setData({
      editStute: false
    })
    if(that.data.myTagData.length > 0){
      that.data.myTagData.forEach(item=>{
          listParas.push(
                {
                  order: "1",
                  tag: item.tag,
                  uid: '1'
                }
            )
      })
    }else{
      listParas =[]
    }
    that.setData({
      tabLists:that.data.myTagData
    })
    that.refreTagList(listParas);
  },
  tagsShare:function () {
      var that = this;
      wx.hideTabBar();
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
      that.tagsShareSearch();
      that.forYouSearchTag();
    },
  forYouSearchTag:function () {
      var that = this;
      wx.request({
      url:'http://106.54.73.125:8101/remote/tag/search',
      method:"POST",
      data:{
        pageSize:'999',
        currentPage:'1'
      },
       header:{
         'Content-Type':'application/json'
       },
       success: function (res) {
        if(res.data.data !== null){
          if(that.data.myTagData.length >0){
            let arrData = [...res.data.data].filter(x => [...that.data.myTagData].every(y => y.tag !== x.tag));
            that.setData({
              forYouData: arrData
            })
          }else{
            that.setData({
              forYouData: res.data.data
            })
          }
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
  tagsShareSearch:function () {
      var that = this;
      wx.request({
      url:'http://106.54.73.125:8102/remote/mytag/search/1',
      method:"GET",
       header:{
         'Content-Type':'application/json'
       },
       success: function (res) {
            that.setData({
              myTagData:res.data.data
            })
            that.setData({
              tabLists: res.data.data
            })
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
   // addTags:function (tegNum) {
    //   var that = this;
    //   wx.request({
    //   url:'http://106.54.73.125:8102/remote/mytag/add',
    //   method:"POST",
    //   data:{
    //     tag:tegNum,
    //     uid:'1' //用户id
    //   },
    //   header:{
    //      'Content-Type':'application/json'
    //    },
    //    success: function (res) {
    //      that.setData({
    //          editSwith:true
    //      })
    //     //  that.tagsShareSearch();
    //     //  that.forYouSearchTag();  
    //      console.log('zengjia')
    //   },
    //   fail: function (res) {
    //     console.log('.........fail..........');
    //   }
    //   })
    // },
    // addListTags:function (listNum) {
    //   var that = this;
    //   wx.request({
    //   url:'http://106.54.73.125:8102/remote/mytag/batchAdd',
    //   method:"POST",
    //   data:{
    //     list: listNum
    //   },
    //   header:{
    //      'Content-Type':'application/json'
    //    },
    //    success: function (res) {
    //     console.log('我是批量++++',res);
    //     that.setData({
    //       editSwith:true
    //     })
    //     // that.tagsShareSearch();
    //     // that.forYouSearchTag();
    //   },
    //   fail: function (res) {
    //     console.log('.........fail..........');
    //   }
    //   })
    // },
    // deteleListTags:function (paraseArray) {
    //   var that = this;
    //   wx.request({
    //   url:'http://106.54.73.125:8102/remote/mytag/batchDelete',
    //   method:"POST",
    //   data:{
    //     list: paraseArray
    //   },
    //   header:{
    //      'Content-Type':'application/json'
    //    },
    //    success: function (res) {
    //     that.setData({
    //       editSwith:true
    //     })
    //     // that.tagsShareSearch();
    //     // that.forYouSearchTag();
    //      console.log("我是批量删除");
    //   },
    //   fail: function (res) {
    //     console.log('.........fail..........');
    //   }
    //   })
    // },
    // deteleTags:function (idNum) {
    //   var that = this;
    //   var idNum =idNum;
    //   wx.request({
    //   url:`http://106.54.73.125:8102/remote/mytag/delete/${idNum}`,
    //   method:"GET",
    //    header:{
    //      'Content-Type':'application/json'
    //    },
    //    success: function (res) {
    //     that.setData({
    //       editSwith:true
    //     })
    //     // that.tagsShareSearch();
    //     // that.forYouSearchTag();
    //     console.log('我是单删除',res);
    //   },
    //   fail: function (res) {
    //     console.log('.........fail..........');
    //   }
    //   })
    // },
  refreTagList:function(listNum){
            var that = this;
            wx.request({
            url:'http://106.54.73.125:8102/remote/mytag/batchUpdateMytag',
            method:"POST",
            data:{list: listNum},
            header:{
              'Content-Type':'application/json'
            },
            success: function (res) {
              that.setData({
                editSwith:true
              })
            },
            fail: function (res) {
              console.log('.........fail..........');
            }
      })
    },
  myTagItemFun:function (e) {
      var that = this;
      var clickIndex = e.currentTarget.dataset.index;
      if(that.data.editStute === false){
      }else{
        var myTagFilter = that.data.myTagData;
        that.data.deleteTagArray.push(myTagFilter[clickIndex])
        var conceArray = [...that.data.forYouData,...that.data.deleteTagArray];
        var curArray = conceArray.reduce((acc, cur) => {
          !acc.some(v => v.tag === cur.tag) && acc.push(cur);
          return acc;
        }, []);
        that.setData({
           forYouData: curArray
        })
        that.setData({
          deleteTagArray:[]
        })
        var myTagFilterNewArray = myTagFilter.filter(item => item.tag !== that.data.myTagData[clickIndex].tag);
        that.setData({
          myTagData: myTagFilterNewArray
        })
      }
    },
  addTagBbtn:function(e){
      var that = this;
      var clickIndex = e.currentTarget.dataset.index;
      var addBtn = that.data.forYouData;
      if(that.data.editStute){
            that.data.addTagArray.push(addBtn[clickIndex])
            var arrayOld = [...that.data.myTagData,...that.data.addTagArray]
            var ccArray = arrayOld.reduce((acc, cur) => {
              !acc.some(v => v.tag === cur.tag) && acc.push(cur);
              return acc;
            }, []);
            that.setData({
              myTagData: ccArray
            })
            that.setData({
                addTagArray:[]
            })
            var addBtnNewArray = addBtn.filter(item => item.tag !== that.data.forYouData[clickIndex].tag);
              that.setData({
                  forYouData: addBtnNewArray
                })
            }
    },
  collectionAdd:function (articleId) {
      var that = this;
      wx.request({
      url:'http://106.54.73.125:8102/remote/article/collection/add',
      method:"POST",
      data:{
        uid :1,
        articleId : articleId
       },
       header:{
         'Content-Type':'application/json'
       },
       success: function (res) {
         var nodeId = that.data.listData.findIndex(item=>{
             return item.id === articleId
         })
         if(nodeId > -1){
             that.data.listData[nodeId].isCollect = true;
             that.data.selectCollData.push({
                articleId: that.data.listData[nodeId].id,
                uid:1
             })
         }
         that.setData({
             listData: that.data.listData
         })
       },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
    collectionDetele:function (articleId) {
      var that = this;
      wx.request({
      url:'http://106.54.73.125:8102/remote/article/collection/delete',
      method:"DELETE",
      data:{
          uid:'1',
          articleId: articleId
       },
       header:{
         'Content-Type':'application/json'
       },
       success: function (res) {
          var nodeSele = that.data.listData.findIndex(item=>{
              return item.id  === articleId
          })
          if(nodeSele > -1){
            console.log('nodeSele',nodeSele)
             that.data.listData[nodeSele].isCollect = false
          }
          that.setData({
            listData: that.data.listData
          })
          console.log('that.data.selectCollData',that.data.selectCollData);
       },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
    collectionQueryCounts:function () {
      var that = this;
      var listId=[]
      var selectCollCount = that.data.selectCollData;
      console.log('selectCollCount',selectCollCount);
      listId = selectCollCount.reduce((acc, cur) => {
        !acc.some(v => v.articleId === cur.articleId) && acc.push(cur);
        return acc;
      }, []);
      console.log('listId',listId);
      wx.request({
      url:'http://106.54.73.125:8102/remote/article/collection/queryCountsAndStatus',
      method:"POST",
      data:{listId},
      header:{
         'Content-Type':'application/json'
       },
       success: function (res) {
        console.log("取消文章收藏");
       },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
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
      this.animation.translateY(1000).step()
      this.setData({
        animationData: this.animation.export(),
      })
      this.setData({
        editStute:false
      })
      this.setData({
        editSwith: true
      })
    },
    closePage:function(){
      var that =this;
      that.fadeDown();
      that.setData({
         hideModal: true
      })
      wx.showTabBar();
    },
    timestampToTime :function (timestamp){
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D;
    },
})