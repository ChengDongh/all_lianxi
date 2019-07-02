// 封装过滤器

// 根据身份证号码判断男女
let sexIdcardFilter = value => {
  if (!value) {
    return ''
  } else {
    let data = value.substr(16, 1) % 2 === 1 ? '男' : '女'
    return data
  }
}

// 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个
let IDcardHide = num => {
  let data = num.replace(/(\d{8})\d{8}(\d*)/, '$1********$2')
  return data
}

// 手机号脱敏('13912345678' 转换成 '139****5678') 第3位开始替换4个
let telHide = num => {
  let data = num.replace(/(\d{3})\d{4}(\d*)/, '$1****$2')
  return data
}

// 姓名脱敏(小明 转换成 *明   李小明 转换成 李*明   欧阳小明 转换成 欧**明)
let nameHide = name => {
  if (name.length === 2) {
    return new Array(name.length).join('*') + name.substr(-1)
  } else {
    return (
      name.substr(0, 1) + new Array(name.length - 1).join('*') + name.substr(-1)
    )
  }
}

export default {
  sexIdcardFilter,
  IDcardHide,
  telHide,
  nameHide
}
