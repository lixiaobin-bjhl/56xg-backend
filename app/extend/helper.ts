
module.exports = {
    /**
     * 生成timestamp, 微信api使用
     */
    generateTimeStamp() {
        return Math.floor(new Date().getTime() / 1000)
    },
    /**
     * 下单时，获取业务信息
     */
    async getOrderHeaderDto(orderId, amount, title) {
        let sql = `select i.goods_ids as goodsIds,i.branch_department_id as branchDepartmentId, i.apply_department_id as applyDepartmentId, i.business_unit_id as businessUnitId, i.customer_name as customerName, i.customer_phone as customerPhone from orders i where id = ?`
        let result = await this.app.mysql.query(sql, orderId)
        return {
            bizOrderNum: orderId,
            branchDepartmentId: result[0].branchDepartmentId,
            applyDepartmentId: result[0].applyDepartmentId,
            businessUnitId: result[0].businessUnitId,
            customerName: result[0].customerName,
            amount: amount,
            customerPhone: result[0].customerPhone,
            goodName: title,
            goodNum: result[0].goodsIds
        }
    },
    getRandomInfo() {
        let goodsDepartmentIdList = [93, 92, 614]
        let applyDepartmentIdList = [93, 92, 614]
        let businessUnitIdList = [1, 4, 12]
        let phoneList = ['18521599731', '15088695586', '18971459260']
        let arr: any = []
        goodsDepartmentIdList.forEach((item, index) => {
            businessUnitIdList.forEach(v => {
                applyDepartmentIdList.forEach(h => {
                    let obj = {
                        branchDepartmentId: item,
                        applyDepartmentId: h,
                        businessUnitId: v,
                        customerName: `测试${index + 1}`,
                        customerPhone: phoneList[index],
                    }
                    arr.push({ ...obj })
                })
            })
        })
        let randomNumber = Math.floor(Math.random() * 100) < 27 ? Math.floor(Math.random() * 100) : Math.floor(Math.random() * 100) % 27
        return arr[randomNumber]
    },
    /**
     * 生成微信用到的noncestr
     */
    generateNoncestr(): string {
        return Math.random().toString(36).substr(2, 15)
    },
    success(data, pageDto) {
        let result = {
            code: 0,
            data: data
        }
        if (pageDto) {
            Object.assign(result, {
                pageDto
            })
        }
        return result
    },
    /**
     * 获取pageDto
     */
    getPageDto(count: number): Object {
        // 请求pageDto
        let pageDto = this.ctx.request.body.pageDto || {}
        return {
            count,
            pageNum: pageDto.pageNum || 1,
            pageSize: pageDto.pageSize || 20
        }
    },
    error(code, message) {
        let result = {
            code: code,
            msg: message
        }
        return result
    },
    /**
     * 根据对象拼接sql语句
     */
    where(query: object) {
        if (!query) {
            return ''
        }
        const wheres: string[] = []
        const values: string[] = []
        for (const key in query) {
            const value = query[key]
            if (Array.isArray(value)) {
                wheres.push('?? IN (?)')
            // 多字段like
            } else if (String(value).indexOf('%') > -1 && key.indexOf('|') > -1) {
                let keys = key.split('|')
                let temp = keys.map(() => {
                    return '?? LIKE (?)'
                })
                wheres.push('(' + temp.join(' or ') + ')')
                keys.forEach((v) => {
                    values.push(v)
                    values.push(value)
                })
                continue
            } else if (String(value).indexOf('%') > -1) {
                wheres.push('?? LIKE (?)')
            } else if (String(key).indexOf('>=') > -1) {
                wheres.push('?? >= ?')
            } else if (String(key).indexOf('<') > -1) {
                wheres.push('?? < ?')
            } else if (String(key).indexOf('>') > -1) {
                wheres.push('?? > ?')
            } else {
                wheres.push('?? = ?')
            }
            values.push(key.replace(/>=|<|>/g, ''))
            values.push(value)
        }
        if (wheres.length > 0) {
            return this.ctx.app.mysql.format(' WHERE ' + wheres.join(' AND '), values)
        }
        return ''
    }
}