/**
 * 格式化日期
 * @param {string | number | Date} date 要格式化的日期
 * @param {string} format 格式化模式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return '';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
};

/**
 * 获取相对时间
 * @param {string | number | Date} date 要计算的日期
 * @returns {string} 相对时间字符串
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    // 转换为秒
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return '刚刚';
    }

    // 转换为分钟
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes}分钟前`;
    }

    // 转换为小时
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours}小时前`;
    }

    // 转换为天
    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days}天前`;
    }

    // 超过30天则返回具体日期
    return formatDate(date, 'YYYY-MM-DD');
};

/**
 * 判断是否为同一天
 * @param {Date} date1 第一个日期
 * @param {Date} date2 第二个日期
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};