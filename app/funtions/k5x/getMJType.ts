/**
 * 获取麻将类型
 */

/**
 * 获取麻将类型
 *
 * @param {number} id 麻将id
 *
 * @returns {number} 麻将类型
 */
export default function (id) {
    if (id >= 0 && id < 9) {
        // 筒
        return 0
    }
    else if (id >= 9 && id < 18) {
        // 条
        return 1
    } else if (id >= 18 && id < 21) {
        // 中发白
        return 2
    }
}