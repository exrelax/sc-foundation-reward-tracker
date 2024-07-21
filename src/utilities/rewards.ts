import dayjs, { Dayjs } from 'dayjs'
import foundationData, {
    type AccountRole,
    type GuidingCategory,
    type Item,
    type ItemType,
    type RewardCondition,
} from '@/assets/data/foundation/foundation.js'

const {
    accountRoles,
    items,
    itemTypes,
    rewardConditions,
    guidingCategories,
    weekendConditionIds,
} = foundationData

export interface Condition extends Omit<RewardCondition, 'fromDate' | 'toDate'> {
    fromDate: Date
    toDate: Date
    accountRole: AccountRole
    guidingCategory?: GuidingCategory | undefined
}

export interface Reward extends Omit<Item, 'fromDate' | 'toDate'> {
    type: ItemType
    condition: Condition
    nowAvailable: boolean
    stillAvailable: boolean
}

const getConditions = () => {
    return rewardConditions.map((condition) => {
        const fromDate = dayjs(condition.fromDate).toDate()
        const toDate = dayjs(condition.toDate).toDate()
        const accountRole = getAccountRoleById(condition.accountRole_id)
        const guidingCategory = getGuidingCategoryById(condition.guidingCategory_id)

        return {
            ...condition,
            fromDate,
            toDate,
            accountRole,
            guidingCategory,
        } as Condition
    })
}

const getRewards = () => {
    return items.map((item) => {
        const now = dayjs()
        const type = itemTypes.find((type) => type.id === item.type_id)
        const condition = conditions.find(
            (condition) => condition.reward_id === item.id,
        )
        const fromDate = condition != null ? dayjs(condition.fromDate) : null
        const toDate = condition != null ? dayjs(condition.toDate) : null
        const nowAvailable = fromDate != null && toDate != null ?
            now.isAfter(fromDate) && now.isBefore(toDate) :
            false
        const stillAvailable = toDate != null ?
            now.isBefore(toDate) :
            false

        return {
            ...item,
            type,
            condition,
            nowAvailable,
            stillAvailable,
        } as Reward
    })
}

const getAccountRoleById = (id: string | null | undefined) => {
    return accountRoles.find((role) => role.id === id)
}

const getCurrentWeekendCondition = () => {
    const now = dayjs()
    return getWeekendConditions().find((condition) => {
        const fromDate = dayjs(condition.fromDate)
        const toDate = dayjs(condition.toDate)
        return now.isAfter(fromDate) && now.isBefore(toDate)
    })
}

const getGuidingCategoryById = (id: string | null | undefined): GuidingCategory | void => {
    return guidingCategories.find((category) => category.id === id)
}

const getRewardById = (id: string): Reward | void => {
    return rewards.find((reward) => reward.id === id)
}

const getWeekendConditions = () => {
    return conditions.filter((condition) => {
            return weekendConditionIds.includes(condition.id)
        })
        .sort((condition1, condition2) => {
            const condition1FromDate = dayjs(condition1.fromDate)
            const condition2FromDate = dayjs(condition2.fromDate)
            if (condition1FromDate.isBefore(condition2FromDate)) {
                return -1
            } else {
                return 1
            }
        })
}

const conditions = getConditions()
const rewards = getRewards()

export {
    conditions,
    rewards,
    getConditions,
    getRewards,
    getAccountRoleById,
    getCurrentWeekendCondition,
    getGuidingCategoryById,
    getRewardById,
    getWeekendConditions,
}