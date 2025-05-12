// @ts-nocheck
/**
 * xlsx单元格中的数据分割（默认空格）
 * @param {string} str - 需要分割的字符串
 * @param {string} partition - 分割符，默认为空格
 */
const cellDataFormat = (str, partition) => {
  partition = partition || /s+/;
  if (str) {
    let arr = str.split(partition);
    let temp = [];
    for (let i = 0; i < arr.length; i++) {
      let r = arr[i] ? arr[i].trim() : '';
      if (r) {
        temp.push(r);
      }
    }
    return temp;
  }
  return [];
}




module.exports = {
  cellDataFormat,
}