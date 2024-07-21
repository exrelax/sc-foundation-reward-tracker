export interface AccountRole {
    id: string
    name: string
}

export interface GuidingCategory {
    id: string
    name: string
}

export interface ItemType {
    id: string
    name: string
}

export interface Item {
    id: string
    name: string
    type_id: string
}

export interface RewardCondition {
    id: string
    reward_id: string
    accountRole_id: string | null | undefined
    fromDate: Date
    toDate: Date
    guidingCategory_id: string | null | undefined
    sessions: number
}

export type WeekendConditionIds = string[]

export const accountRoles: AccountRole[]
export const guidingCategories: GuidingCategory[]
export const itemTypes: ItemType[]
export const items: Item[]
export const rewardConditions: RewardCondition[]
export const weekendConditionIds: WeekendConditionIds

declare const _default: {
    accountRoles: AccountRole[]
    guidingCategories: GuidingCategory[]
    itemTypes: ItemType[]
    items: Item[]
    rewardConditions: RewardCondition[]
    weekendConditionIds: WeekendConditionIds
}

export default _default