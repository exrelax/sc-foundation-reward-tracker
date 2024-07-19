import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

interface GuidingSession {
    id: string;
    roles: {
        account: string;
        accountRole_id: string;
    }[];
    guidingCategory_ids: string[];
    completed: boolean;
    fromDate: Date;
    toDate?: Date;
}

export const useGuidingSessionsStore = defineStore('guidingSessions', () => {
    const sessions = ref([])

    const getSessionById = computed(() => {
        return (id) => {
            return sessions.value.find(session => session.id === id)
        }
    })

    const getSessionByAccountHandle = computed(() => {
        return (accountHandle) => {
            return sessions.value.filter(session => {
                return session.roles.some(role => role.account === accountHandle)
            })
        }
    })

    const sessionRolesIsValid = (roles: GuidingSession['roles']) => {
        return roles.length >= 2 && roles.every(role => role.account && role.accountRole_id)
    }

    const sessionIsValid = (session: GuidingSession) => {
        return sessionRolesIsValid(session.roles) &&
            session.guidingCategory_ids.length > 0 &&
            session.fromDate != null
    }

    const addSession = (session: GuidingSession) => {
        if (!sessionIsValid(session)) {
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

        return true
    }

    return { sessions, addSession, getSessionById, getSessionByAccountHandle }
})
