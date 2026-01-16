import CryptoJS from 'crypto-js'

export function encrypt(password, salt) {
    // 使用与后端相同的加密算法
    return CryptoJS.SHA256(password + salt).toString()
}