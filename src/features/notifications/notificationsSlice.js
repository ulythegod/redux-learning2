import { 
  createSlice, 
  createAsyncThunk,
  createEntityAdapter, 
  createSelector,
  isAnyOf,
  createAction
} from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { forceGenerateNotifications } from '../../api/server';
import { apiSlice } from "../../api/apiSlice";

const notificationsReceived = createAction(
  'notifications/notificationsReceived'
);

export const extendedApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        //создание вебсокет коннекта когда кэш подписки запускается
        const ws = new WebSocket('ws://localhost');
        try {
          //ожидание инициализации очереди для решения перед продолжением
          await cacheDataLoaded;

          //когда данные получены из коннекта сокета с сервером
          //обновляется результат очереди с полученным сообщением
          const listener = event => {
            const message = JSON.parse(event.data);
            switch (message.type) {
              case 'notifications': {
                updateCachedData(draft => {
                  //вставка всех полученных уведомлений из вебсокета
                  //в существующий кэш массив RTKQ
                  draft.push(...message.payload);
                  draft.sort((a, b) => b.date.localeCompare(a.date));
                })
                //отправка всех дополнительных действий, так что можно отследить состояние read
                dispatch(notificationsReceived(message.payload))
                break
              }
              default:
                break
            }
          }

          ws.addEventListener('message', listener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        //cacheEntryRemoved будет решать когда кэш подписка больше не активна
        await cacheEntryRemoved
        //выполнение шагов очистки, когда cacheEntryRemoved промис все решит
        ws.close();
      }
    })
  })
})

export const { useGetNotificationsQuery } = extendedApi;

const emptyNotifications = [];

export const selectNotificationsResult = extendedApi.endpoints.getNotifications.select();

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  notificationsResult => notificationsResult.data ?? emptyNotifications
)

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification?.date ?? '';

  //захардкоденный вызов мок сервера для запуска сценария над вебсокетами 
  forceGenerateNotifications(latestTimestamp);
}

const notificationsAdapter = createEntityAdapter()

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
)
  const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: notificationsAdapter.getInitialState(),
    reducers: {
        allNotificationsRead(state, action) {
            Object.values(state.entities).forEach(notification => {
                notification.read = true
            });
        }
    },
    extraReducers(builder) {
      builder.addMatcher(matchNotificationsReceived, (state, action) => {
        // Add client-side metadata for tracking new notifications
        const notificationsMetadata = action.payload.map(notification => ({
          id: notification.id,
          read: false,
          isNew: true
        }))
  
        Object.values(state.entities).forEach(notification => {
          // Any notifications we've read are no longer new
          notification.isNew = !notification.read
        })
  
        notificationsAdapter.upsertMany(state, notificationsMetadata)
      })
    }
  })
  
  export default notificationsSlice.reducer
  
  export const {
    selectAll: selectNotificationsMetadata,
    selectEntities: selectMetadataEntities
  } = notificationsAdapter.getSelectors(state => state.notifications)

  export const {allNotificationsRead} = notificationsSlice.actions