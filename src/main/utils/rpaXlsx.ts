// @ts-nocheck
const XLSX = require('xlsx');
const { utils } = require('xlsx');

/**
 * 默认的数据转换器函数，用于将表格数据转换为对象数组
 * @param data - 输入的表格数据，为二维数组类型。
 * @returns 转换后的对象数组。
 */
const defaultConverter = (data) => {
  if (data.length < 2) return []
  // 提取表头
  const headers = data[0];
  // 转换为对象数组
  let result = []
   data.slice(1).forEach((row) => {
    const obj = {};
    let hasContent = false
    headers.forEach((header, index) => {
      obj[header] = row[index];
      if (row[index]) hasContent = true
    });
     if (hasContent) result.push(obj) 
  });
  return result;
}

 async function parseExcel(options) {
  try {
    // 读取 Excel 文件 ‌:ml-citation{ref="2,3" data="citationList"}
    const workbook = XLSX.readFile(options.filePath);

    // 获取工作表 ‌:ml-citation{ref="3" data="citationList"}
    const sheetName = options.sheetName || workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // console.log(worksheet)

    // 转换 JSON 数据 ‌:ml-citation{ref="3" data="citationList"}
    const rawData = utils.sheet_to_json(worksheet, {
      header: options.headerRow || 1,
      // range: options.dataStartRow || (options.headerRow ? options.headerRow + 1 : 2)
    });
    
    // console.log(rawData)
    // 自定义数据转换 ‌:ml-citation{ref="7" data="citationList"}
    return (options.dataConverter?.(rawData) || defaultConverter(rawData));
  } catch (error) {
    console.error('Excel 解析失败:', error);
    throw new Error(`Excel 解析失败: ${(error).message}`);
  }
}

module.exports = {
  parseExcel
}