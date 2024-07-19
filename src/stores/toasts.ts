import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

export interface Toast {
    id: string;
    date: Date;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning';
}

let timeout = null

export const useToastsStore = defineStore('toasts', () => {
    const toasts = ref([])
    const limit = 5
    const toastsDurability = 20 * 1000
    const toastsCleanupTimer = 60 * 1000

    const _createAgeValuesForToast = (toast: Toast) => {
        let ageString = ''
        const now = dayjs()
        const toastDate = dayjs(toast.date)

        const ageInSeconds = now.diff(toastDate, 'second')
        const ageInMinutes = now.diff(toastDate, 'minute', true)

        if (ageInSeconds < 5) {
            ageString = 'just now'
        } else if (ageInSeconds < 60) {
            ageString = `${ageInSeconds} seconds ago`
        } else if (ageInMinutes < 60) {
            const flooredAgeInMinutes = Math.floor(ageInMinutes)
            const seconds = Math.floor((ageInMinutes - flooredAgeInMinutes) * 60)
            const minutesString = flooredAgeInMinutes === 1 ? 'minute' : 'minutes'
            ageString = `${flooredAgeInMinutes} ${minutesString} and ${seconds} ago`
        } else {
            ageString = `${now.diff(toastDate, 'hour')} hours ago`
        }

        return {
            ageInSeconds,
            ageInMinutes,
            ageString,
        }
    }

    const _getToastWithAgeValues = (toast: Toast) => {
        const { ageInSeconds, ageInMinutes, ageString } = _createAgeValuesForToast(toast)

        return {
            ...toast,
            ageInSeconds,
            ageInMinutes,
            ageString,
        }
    }

    const _getActiveToasts = () => {
        const now = dayjs()
        const reversedToasts = toasts.value.toReversed()

        return reversedToasts
            .filter(toast =>  now.diff(toast.date, 'millisecond') < toastsDurability)
            .filter((toast, index) => index < limit)
    }

    const _cleanupToasts = () => {
        const now = dayjs()

        toasts.value = toasts.value.reduce((accumulator, toast) => {
            if (now.diff(toast.date, 'millisecond') < toastsCleanupTimer) {
                accumulator.push(toast)
            }

            return accumulator
        }, [])
    }

    const activeToasts = computed(() => {
        return _getActiveToasts()
    })

    const getActiveToasts = computed(() => {
        return () => {
            return _getActiveToasts()
        }
    })

    const getToastWithAgeValues = computed(() => {
        return (toast) => {
            return _getToastWithAgeValues(toast)
        }
    })

    const getToastsWithAgeValues = computed(() => {
        return (onlyActive = true) => {
            let toastsToUse = onlyActive ? _getActiveToasts() : toasts.value

            return toastsToUse.map(_getToastWithAgeValues)
        }
    })

    const toastIsValid = (toast: Toast) => {
        return toast.title != null && toast.message != null && toast.type != null
    }

    const addToast = (toast: Toast) => {
        _cleanupToasts()

        if (!toastIsValid(toast)) {
            return false
        }

        toasts.value.push({
            ...toast,
            id: uuidv4(),
            date: dayjs(),
        })

        return true
    }

    const removeToast = (id: string) => {
        toasts.value = toasts.value.filter(toast => toast.id !== id)

        return true
    }

    return {
        toasts,
        toastsDurability,
        activeToasts,
        addToast,
        removeToast,
        getActiveToasts,
        getToastWithAgeValues,
        getToastsWithAgeValues
    }
})
