<script setup>
import { defineProps, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  sessions: {
    type: Array,
    required: true,
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
        <th>Guide</th>
        <th>Recruit</th>
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
        <td>{{ session.roles?.find(role => role.accountRole_id === 'guide')?.account }}</td>
        <td>{{ session.roles?.find(role => role.accountRole_id === 'recruit')?.account }}</td>
        <td>{{ session.guidingCategory_ids?.join(', ') }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>