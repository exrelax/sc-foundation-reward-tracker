import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import {
    type GuidingSessionPayload,
    type GuidingSession
} from '@/models/guidingSession.model'

interface Account {
    id: string;
    handle: string;
    monitored?: boolean;
}

export const useGuidingSessionsStore = defineStore('guidingSessions', () => {
        const accounts = ref([] as Account[])
        const sessions = ref([] as GuidingSession[])

        const createAccount = (handle: string, monitored: boolean = true) => {
            const account = getAccountByHandle.value(handle)

            if (account) {
                return
            }

            accounts.value.push({
                id: uuidv4(),
                handle,
                monitored
            })
        }

        const removeAccountById = (id: string) => {
            const index = accounts.value.findIndex(account => account.id === id)

            if (index > -1) {
                accounts.value.splice(index, 1)
            }
        }

        const removeAccountByHandle = (handle: string) => {
            const index = accounts.value.findIndex(account => account.handle === handle)

            if (index > -1) {
                accounts.value.splice(index, 1)
            }
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

        const getSessionByAccountHandle = computed(() => {
            return (accountHandle: string) => {
                return sessions.value.filter(session => {
                    return session.roles.some(role => role.account === accountHandle)
                })
            }
        })

        const getGuideSessionByAccountHandle = computed(() => {
            return (accountHandle: string) => {
                return sessions.value.filter(session => {
                    return session.roles.some(role => role.accountRole_id === 'guide' && role.account === accountHandle)
                })
            }
        })

        const getRecruitSessionByAccountHandle = computed(() => {
            return (accountHandle: string) => {
                return sessions.value.filter(session => {
                    return session.roles.some(role => role.accountRole_id === 'recruit' && role.account === accountHandle)
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

        return {
            accounts,
            sessions,
            addSession,
            getAccountById,
            getAccountByHandle,
            getSessionById,
            getSessionByAccountHandle,
            getGuideSessionByAccountHandle,
            getRecruitSessionByAccountHandle,
            restoreSessionDates,
        }
    },
    {
        persist: {
            storage: localStorage,
            paths: [ 'accounts', 'sessions' ],
            afterRestore: (ctx) => {
                ctx.store.restoreSessionDates()
            }
        }
    }
)
