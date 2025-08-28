// 模拟数据示例
module.exports = [
  {
    url: '/api/test',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'success',
        data: {
          name: 'mock data',
          value: '这是一条模拟数据'
        }
      }
    }
  }
]