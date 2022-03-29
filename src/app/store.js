import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice';
import notificationsReducer from "../features/notifications/notificationsSlice";
import { apiSlice } from "../api/apiSlice";

//говорим REdux, что на высшем уровне состояния нам нужно поле, названное posts 
//и все данные для state.posts будут обновляться с помощью функции postsReducer 
//когда действия будут отправляться
export default configureStore({
    reducer: {
        posts: postsReducer,
        notifications: notificationsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(apiSlice.middleware)
})