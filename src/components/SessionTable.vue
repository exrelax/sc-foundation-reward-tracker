<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  sessions: {
    type: Array,
    required: true,
  },
  showGuide: {
    type: Boolean,
    default: true,
  },
  showRecruit: {
    type: Boolean,
    default: true,
  },
  linkGuideAccount: {
    type: Boolean,
    default: true,
  },
  linkRecruitAccount: {
    type: Boolean,
    default: true,
  },
})

const sessions = computed(() => {
  return props.sessions.map((session) => {
    return {
      ...session,
      fromDate: dayjs(session.fromDate).format('YYYY-MM-DD HH:mm'),
      toDate: dayjs(session.toDate).format('YYYY-MM-DD HH:mm'),
      duration: dayjs(session.toDate).diff(dayjs(session.fromDate), 'minute'),
    }
  })
})
</script>

<template>
  <table class="table mt-3">
    <thead>
      <tr>
        <th>Start</th>
        <th>End</th>
        <th>Duration</th>
        <th v-if="props.showGuide">Guide</th>
        <th v-if="props.showRecruit">Recruit</th>
        <th>Guiding Categories</th>
        <th>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(session, index) in sessions" :key="`${session.id}-${index}`">
        <td>{{ session.fromDate }}</td>
        <td>{{ session.toDate }}</td>
        <td>{{ session.duration }}</td>
        <td v-if="props.showGuide">
          <router-link v-if="props.linkGuideAccount" :to="`/account/${session.roles?.find(role => role.accountRole_id === 'guide')?.account}`">{{ session.roles?.find(role => role.accountRole_id === 'guide')?.account }}</router-link>
          <span v-else>{{ session.roles?.find(role => role.accountRole_id === 'guide')?.account }}</span>
        </td>
        <td v-if="props.showRecruit">
          <router-link v-if="props.linkRecruitAccount" :to="`/account/${session.roles?.find(role => role.accountRole_id === 'recruit')?.account}`">{{ session.roles?.find(role => role.accountRole_id === 'recruit')?.account }}</router-link>
          <span v-else>{{ session.roles?.find(role => role.accountRole_id === 'recruit')?.account }}</span>
        </td>
        <td>{{ session.guidingCategory_ids?.join(', ') }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>