
import { Service } from 'egg'
import shuffle from '../funtions/k5x/shuffle'
import getMJType from '../funtions/k5x/getMJType'

/**
 * ms service
 */
export default class MJ extends Service {

    public getMJType = getMJType
    /**
     * 洗牌
     */
    public shuffle = shuffle
}
