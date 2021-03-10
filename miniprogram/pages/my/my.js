//获取小程序实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    isAuth: false,
    userInfoData:{}
  },
  mybill() {
    wx.navigateTo({
      url: "../mybill/mybill",
    })
  },
 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    setTimeout(() => {
      this.setData({
        loading: false
      })
    }, 10)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getUserInfo();
    this.setData({
      isAuth: app.globalData.isAuth
    })
  },
  getUserInfo() {
    if (app.globalData.isAuth) {
      //必须授权后才可以执行
      wx.getUserInfo({
        success: res => {
          this.setData({
            userInfoData: res.userInfo
          })
          console.log('this.data.userInfoData ==> ', this.data.userInfoData);
        }
      })
    }
  },
  //获取用户授权信息
  getuserAuthInfo(res) {
    console.log('res ==> ', res);
    if (res.detail.userInfo) {
      app.globalData.isAuth = true;
      this.setData({
        isAuth: true,
        userInfoData: res.detail.userInfo
      })
    }

  }
})