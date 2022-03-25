import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";

/**
 * второй аргумент пейлоад создателя - это объект thunkAPI, у него есть несколько полезных функций и информации.
 * - dispatch и getState - реальные dispatch и getState методы из Redux-хранилища, можно использовать их внутри
 * thunk-ф-ции для получения большего кол-ва действий, или получения последнего состояния Redux-хранилища
 * - extra - дополнительный аргумент, кот. мб передан в thunk middleware при создании хранилища. Обычно
 * какая-то обертка над API типа набора функций, кот. знают как делать API запросы к серверу вашего приложения 
 * и возвращают данные, так что thunk-ф-циям не нужно хранить все url и логику очередей внутри
 * - requestId - уникальный рандомный ID для этого вызова thunk. Полезный для отслеживания статуса каждого запроса
 * - signal - AbortController.signal - ф-ция, которая мб использована для отмены прогресса запроса
 * - rejectWithValue - помогает кастомизировать контент действия rejected, если thunk получает ошибку
 */
 export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState }) => {
      const allNotifications = selectAllNotifications(getState())
      const [latestNotification] = allNotifications
      const latestTimestamp = latestNotification ? latestNotification.date : ''
      const response = await client.get(
        `/fakeApi/notifications?since=${latestTimestamp}`
      );
      return response.data
    }
  )
  
  const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        allNotificationsRead(state, action) {
            state.forEach(notification => {
                notification.read = true
            })
        }
    },
    extraReducers: {
      [fetchNotifications.fulfilled]: (state, action) => {
        state.push(...action.payload)
        state.forEach(notification => {
            notification.isNew = !notification.read
        })
        // Sort with newest first
        state.sort((a, b) => b.date.localeCompare(a.date))
      }
    }
  })
  
  export default notificationsSlice.reducer
  
  export const selectAllNotifications = state => state.notifications

  export const {allNotificationsRead} = notificationsSlice.actions