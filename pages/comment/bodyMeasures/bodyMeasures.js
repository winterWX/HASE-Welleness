// pages/comment/speeds/speeds.js
Page({
  data: {
      physicalData:[
        {name:'体重',value: null},
        {name:'身高',value: null},
        {name:'胸围',value: null}
      ],
      itemUid:'',
      itemId:'',
      contentOpous: false,
      modelShow:false,
      modeName:'',
      itemIndex: '',
      inputValData:'',
      noNullData: null
  },
  onLoad: function () {
    //个人身体数据查询
    var that = this;
    wx.request({
      url: 'http://106.54.73.125:8102/remote/bodyData/search/1',
      method: 'GET',
      header:{
        'Content-Type':'application/json'
      },
      success: function (res) {
          that.setData({
            noNullData : res.data.data
          })
          var resData = res.data.data;
          if(resData !== null){
              var arrayBodyData= [resData.weight,resData.height,resData.bustCircumference];
                var physicalDataCopyArray = that.data.physicalData.slice(0);
                physicalDataCopyArray.forEach((item,index)=>{
                    item.value = arrayBodyData[index]
                })
                that.setData({
                    physicalData : physicalDataCopyArray
                })
                that.setData({
                  itemUid: resData.uid
                })
                that.setData({
                  itemId: resData.id
                })
          }
      },
      fail: function (res) {
        console.log('.........fail000..........');
      }
    })
  },
  bindKeyInput:function(e){
     var that = this;
     that.setData({
       inputValData: e.detail.value
     })
  },
  readDetail:function(e){
    var that = this;
    var $id = e.currentTarget.dataset.id;
    that.setData({
      contentOpous: true
    })
    that.setData({
      modelShow: true
    })
    that.setData({
      modeName: that.data.physicalData[$id].name
    })
    that.setData({
      itemIndex: $id
    })
    that.setData({
      inputValData: that.data.physicalData[$id].value
    })
},
  canelFun :function(){
      var that = this;
      that.setData({
        modelShow :false
      })
      that.setData({
        contentOpous :false
      })
  },
  parmsArrayFun(){
    var that = this;
    var physicalCopyData = that.data.physicalData.slice(0);
    physicalCopyData.forEach(index => {
         if(that.data.itemIndex === index){
            physicalCopyData[index].value =  that.data.inputValData;
         }
    })
    that.setData({
      physicalData : physicalCopyData
    })
    console.log("newData",that.data.physicalData);
    that.setData({
      modelShow :false
    })
    that.setData({
      contentOpous :false
    });
  },
  submitFun:function(){
    var that = this;
    var submitPhysicalData = that.data.physicalData.slice(0);
        submitPhysicalData.forEach((item,index)=> {
             if(that.data.itemIndex === index){
                submitPhysicalData[index].value = that.data.inputValData
             }
        })
    that.setData({
        physicalData : submitPhysicalData
    })
    if(that.data.noNullData === null){
      wx.request({
        url:'http://106.54.73.125:8102/remote/bodyData/add',
        method:'POST',
        data:{
          'id': that.data.itemUid,
          'weight': that.data.physicalData[0].value === null ? '': that.data.physicalData[0].value + '',
          'height': that.data.physicalData[1].value === null ? '':  that.data.physicalData[1].value + '',
          'bustCircumference': that.data.physicalData[2].value === null ? '': that.data.physicalData[2].value + ''
        },
        header:{
          'Content-Type':'application/json'
        },
        success: function (res) {
            that.parmsArrayFun();
            console.log('addaddaddadd',res)
        },
        fail: function (res) {
          console.log('.........fail000..........');
        }
      })
    }else{
      wx.request({
        url:'http://106.54.73.125:8102/remote/bodyData/edit',
        method:'POST',
        data:{
          'id': that.data.itemId,
          'weight': that.data.physicalData[0].value === null ? '': that.data.physicalData[0].value + '',
          'height': that.data.physicalData[1].value === null ? '':  that.data.physicalData[1].value + '',
          'bustCircumference': that.data.physicalData[2].value === null ? '': that.data.physicalData[2].value + ''
        },
        header:{
          'Content-Type':'application/json'
        },
        success: function (res) {
          that.parmsArrayFun();
          console.log('editeditediteditedit',res)
        },
        fail: function (res) {
          console.log('.........fail000..........');
        }
      })
    }
  }
})