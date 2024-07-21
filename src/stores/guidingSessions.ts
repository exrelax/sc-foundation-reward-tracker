import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import {
    type GuidingSessionPayload,
    type GuidingSession
} from '@/models/guidingSession.model'
import { getRewards } from '@/utilities/rewards'

interface Account {
    id: string
    handle: string
    favorite?: boolean
}

interface Meta {
    id: string
    createDate: Date
    updateDate: Date
}

const storeName = 'guidingSessions'

export const useGuidingSessionsStore = defineStore(storeName, () => {
        const accounts = ref([] as Account[])
        const sessions = ref([] as GuidingSession[])
        const meta = ref({
            id: (+new Date).toString(36),
            createDate: dayjs().toDate(),
            updateDate: dayjs().toDate(),
        })

        const updateMeta = () => {
            if (meta.value.id == null) {
                meta.value.id = (+new Date).toString(36)
            }

            if (meta.value.createDate == null) {
                meta.value.createDate = dayjs().toDate()
            }

            meta.value.updateDate = dayjs().toDate()
        }

        const createAccount = (handle: string, favorite: boolean = true) => {
            const account = getAccountByHandle.value(handle)

            if (account) {
                return
            }

            accounts.value.push({
                id: uuidv4(),
                handle,
                favorite
            })

            updateMeta()
        }

        const removeAccountById = (id: string) => {
            const index = accounts.value.findIndex(account => account.id === id)

            if (index === -1) {
                return
            }

            accounts.value.splice(index, 1)
            updateMeta()
        }

        const removeAccountByHandle = (handle: string) => {
            const index = accounts.value.findIndex(account => account.handle === handle)

            if (index === -1) {
                return
            }

            accounts.value.splice(index, 1)
            updateMeta()
        }

        const isValidAccount = (account: any) => {
            return account != null &&
                typeof account.id === 'string' &&
                account.id.length > 0 &&
                typeof account.handle === 'string' &&
                account.handle.length > 0 &&
                typeof account.favorite === 'boolean'
        }

        const isValidSession = (session: any) => {
            return session != null &&
                typeof session.id === 'string' &&
                session.id.length > 0 &&
                session.roles != null &&
                Array.isArray(session.roles) &&
                Array.isArray(session.guidingCategory_ids) &&
                session.guidingCategory_ids.length > 0 &&
                session.fromDate != null
        }

        const isValidAccounts = (accounts: Account[]) => {
            return Array.isArray(accounts) &&
                accounts.every(isValidAccount)
        }

        const isValidSessions = (sessions: GuidingSession[]) => {
            return Array.isArray(sessions) &&
                sessions.every(isValidSession)
        }

        const isValidImportMeta = (meta: any) => {
            return typeof meta.id === 'string' &&
                typeof meta.createDate === 'string' &&
                typeof meta.updateDate === 'string'
        }

        const getAccountById = computed(() => {
            return (id: string) => {
                return accounts.value.find(account => account.id === id)
            }
        })

        const getAccountByHandle = computed(() => {
            return (accountHandle: string) => {
                return accounts.value.find(account => account.handle === accountHandle)
            }
        })

        const getSessionById = computed(() => {
            return (id: string) => {
                return sessions.value.find(session => session.id === id)
            }
        })

        const getSessionsByAccountHandle = computed(() => {
            return (accountHandle: string, givenSessions: GuidingSession[] = sessions.value) => {
                return givenSessions.filter(session => {
                    return session.roles.some(role => role.account === accountHandle)
                })
            }
        })

        const getSessionsByPeriod = computed(() => {
            return (fromDate: Date, toDate: Date, givenSessions: GuidingSession[] = sessions.value) => {
                return givenSessions.filter(session => {
                    const fromDateDjs = dayjs(fromDate)
                    const toDateDjs = dayjs(toDate)

                    return fromDateDjs.isBefore(session.fromDate) &&
                        (session.toDate == null || toDateDjs.isAfter(session.toDate))
                })
            }
        })

        const getSessionsByAccountRoleId = computed(() => {
            return (accountHandle: string, accountRoleId?: string, givenSessions: GuidingSession[] = sessions.value) => {
                return givenSessions.filter(session => {
                    if (accountRoleId == null) {
                        return getSessionsByAccountHandle.value(accountHandle)
                    }

                    return session.roles.some((role) =>
                            role.accountRole_id === accountRoleId &&
                            role.account === accountHandle
                    )
                })
            }
        })

        const getSessionsByGuidingCategoryId = computed(() => {
            return (guidingCategoryId?: string, givenSessions: GuidingSession[] = sessions.value) => {
                if (guidingCategoryId == null) {
                    return givenSessions
                }

                return givenSessions.filter(session => {
                    return session.guidingCategory_ids.includes(guidingCategoryId)
                })
            }
        })

        const getGuideSessionsByAccountHandle = computed(() => {
            return (accountHandle: string) => {
                return sessions.value.filter(session => {
                    return session.roles.some(role => role.accountRole_id === 'guide' && role.account === accountHandle)
                })
            }
        })

        const getRecruitSessionsByAccountHandle = computed(() => {
            return (accountHandle: string) => {
                return sessions.value.filter(session => {
                    return session.roles.some(role => role.accountRole_id === 'recruit' && role.account === accountHandle)
                })
            }
        })

        const getRewardsForAccount = computed(() => {
            return (accountHandle: string) => {
                const rewards = getRewards()
                return rewards.map((reward) => {
                    const { condition } = reward
                    const accountSessions = getSessionsByAccountHandle.value(accountHandle)

                    const sessionsInPeriod = getSessionsByPeriod.value(
                        condition.fromDate,
                        condition.toDate,
                        accountSessions,
                    )

                    const sessionsByAccountRoleId = getSessionsByAccountRoleId.value(
                        accountHandle,
                        condition.accountRole_id ?? void 0,
                        sessionsInPeriod,
                    )

                    const sessionsByGuidingCategoryId = getSessionsByGuidingCategoryId.value(
                        condition.guidingCategory_id ?? void 0,
                        sessionsByAccountRoleId,
                    )

                    return {
                        ...reward,
                        completed: sessionsByGuidingCategoryId.length >= condition.sessions,
                    }
                })
            }
        })

        const sessionRolesIsValid = (roles: GuidingSession['roles']) => {
            return roles.length >= 2 && roles.every(role => role.account && role.accountRole_id)
        }

        const sessionPayloadIdIsValid = (session: GuidingSessionPayload) => {
            return sessionRolesIsValid(session.roles) &&
                session.guidingCategory_ids.length > 0 &&
                session.fromDate != null
        }

        const addSession = (session: GuidingSessionPayload) => {
            if (!sessionPayloadIdIsValid(session)) {
                return false
            }

            updateMeta()

            const fromDateDjs = dayjs(session.fromDate)
            const toDateDjs = session.toDate ? dayjs(session.toDate) : null
            const completed = session.toDate != null && fromDateDjs.isBefore(toDateDjs)

            sessions.value.push({
                ...session,
                id: uuidv4(),
                completed
            })

            session.roles.forEach(role => {
                createAccount(role.account)
            })

            return true
        }

        const getStoreFromStorage = computed(() => {
            return () => {
                const store = localStorage.getItem(storeName)
                return store ? JSON.parse(store) : null
            }
        })

        const importFileDateToStore = (fileData: any) => {
            const {
                accounts: importAccounts,
                sessions: importSessions,
                meta: importMeta
            } = fileData

            console.log(
                importAccounts,
                isValidAccounts(importAccounts),
                importSessions,
                isValidSessions(importSessions),
                importMeta,
                isValidImportMeta(importMeta)
            )

            if (
                !isValidAccounts(importAccounts) ||
                !isValidSessions(importSessions) ||
                !isValidImportMeta(importMeta)
            ) {
                return false
            }

            meta.value = importMeta
            accounts.value = importAccounts
            sessions.value = importSessions

            restoreMetaDates()
            restoreSessionDates()
        }

        const restoreSessionDates = () => {
            sessions.value = sessions.value.map(session => {
                const fromDate = new Date(session.fromDate)
                const toDate = session.toDate ? new Date(session.toDate) : null

                return {
                    ...session,
                    fromDate,
                    toDate
                }
            })
        }

        const restoreMetaDates = () => {
            meta.value.createDate = dayjs(meta.value.createDate).toDate()
            meta.value.updateDate = dayjs(meta.value.updateDate).toDate()
        }

        return {
            accounts,
            sessions,
            meta,
            getAccountById,
            getAccountByHandle,
            getSessionById,
            getSessionsByAccountHandle,
            getGuideSessionsByAccountHandle,
            getRecruitSessionsByAccountHandle,
            getRewardsForAccount,
            getStoreFromStorage,
            addSession,
            importFileDateToStore,
            restoreSessionDates,
            restoreMetaDates,
        }
    },
    {
        persist: {
            storage: localStorage,
            paths: [ 'accounts', 'sessions', 'meta' ],
            afterRestore: (ctx) => {
                ctx.store.restoreSessionDates()
                ctx.store.restoreMetaDates()
            }
        }
    }
)
