import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice';

//говорим REdux, что на высшем уровне состояния нам нужно поле, названное posts 
//и все данные для state.posts будут обновляться с помощью функции postsReducer 
//когда действия будут отправляться
export default configureStore({
    reducer: {
        posts: postsReducer
    }
})