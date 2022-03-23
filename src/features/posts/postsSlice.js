import {createSlice, nanoid} from '@reduxjs/toolkit';
import { sub } from 'date-fns';

const initialState = [
    { id: '1', title: 'First Post!', content: 'Hello!', date:  sub(new Date(), { minutes: 10 }).toISOString(), reactions: {}},
    { id: '2', title: 'Second Post', content: 'More text', date:  sub(new Date(), { minutes: 5 }).toISOString(), reactions: {} }
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        /**
         * createSlice позволяет определять функцию "подготовленный колбэк" при написании редюсера.
         * "подготовленный коллбэк" может получать несколько аргументов, генерировать рандомные значения,
         * типа ID, и запускать другую синхронную логику, если нужно решить какие значения пойдут в объект
         * действия. Функция должна возвращать поле payload (возвращенный объект также должен содержать поле
         * meta, которое может использоваться дополнительными описательными значениями действия и поле error,
         * которое должно быть типа boolean для индикации, что действие представляет какой-то вид ошибки) 
         */
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        date: new Date().toISOString(),
                        title,
                        content,
                        user: userId
                    }
                }
            }
        },
        postUpdated(state, action) {
            const {id, title, content} = action.payload;
            const existingPost = state.find(post => post.id === id);
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload;
            const existingPost = state.find(post => post.id === postId);
            if  (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    }
});

export const {postAdded, postUpdated, reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;