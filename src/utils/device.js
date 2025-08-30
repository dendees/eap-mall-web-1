// 设备检测工具
export const isMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'phone', 'blackberry', 'windows phone']
  
  // 检测用户代理字符串
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
  
  // 检测屏幕宽度（768px 为分界点）
  const isMobileScreen = window.innerWidth <= 768
  
  // 检测触摸设备
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  return isMobileUA || (isMobileScreen && isTouchDevice)
}

export const isPC = () => !isMobile()

// 获取设备类型
export const getDeviceType = () => {
  return isMobile() ? 'mobile' : 'pc'
}

// 监听屏幕尺寸变化
export const watchScreenSize = (callback) => {
  const handleResize = () => {
    callback(getDeviceType())
  }
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}

// 设置根元素的设备类型类名
export const setDeviceClass = () => {
  const deviceType = getDeviceType()
  document.documentElement.className = document.documentElement.className.replace(/device-\w+/g, '')
  document.documentElement.classList.add(`device-${deviceType}`)
  return deviceType
}