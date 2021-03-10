// miniprogram/pages/mybill/mybill.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    bookingData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findMyAllBookingData();
  },
  // 获取我的所有记账数据
  findMyAllBookingData(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.cloud.callFunction({
      name:'find_user_all_data',
      data:{
        listName:'booking'
      }
    }).then(res=>{
      wx.hideLoading();
      console.log(res);
      this.setData({
        bookingData: res.result.data,
        loading: false
      })
    })
  },
  removeDates(e){
    console.log(e.detail._id);
    wx.showModal({
      title: '提示',
      content: '该操作将永久删除数据，是否继续？',
      success: res => {
        if (res.confirm) {
          
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
      
          wx.cloud.callFunction({
            name: 'remove_user_data',
            data: {
              listName: 'booking',
              _id: e.detail._id
            }
          }).then(data => {
            wx.hideLoading();
            console.log('删除记账数据data ==> ', data);

            if (data.result.stats.removed == 1) {
              console.log(e.currentTarget.dataset.index);
              this.data.bookingData.splice(e.currentTarget.dataset.index, 1);
              this.setData({
                bookingData: this.data.bookingData
              })
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              })
            }

          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            })
            console.log('err ==> ', err);
          })

        }
      }
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