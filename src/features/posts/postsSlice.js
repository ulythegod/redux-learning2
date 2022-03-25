import { createSlice, nanoid, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { sub } from 'date-fns';

const initialState = {
    posts: [],
    status: 'idle',
    error: null
};

/**
 * createAsyncThunk принимает два аргумента:
 * - строка которая будет использована как префикс для генерации типов действия
 * - "payload creator" коллбэк фу-ция, которая должна возвращать проми, содержащий некоторые данные, или отклоненные промис с ошибкой
 */
 export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts');

    return response.data;
});

//Sending Data with Thunks
export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    //payload creator получает частично объект `{title, content, user}`
    async initialPost => {
        //мы отправлаем инициализирующие данные на фейковый апи сервер
        const response = await client.post('/fakeApi/posts', initialPost);
        //ответ включает полный объект с постом, включая уникальный ID

        return response.data;
    }
);

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
                state.posts.push(action.payload)
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
            const existingPost = state.posts.find(post => post.id === id);
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload;
            const existingPost = state.posts.find(post => post.id === postId);
            if  (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = state.posts.concat(action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            }).addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
            })
    }
});

export const {postAdded, postUpdated, reactionAdded} = postsSlice.actions;

export default postsSlice.reducer;

export const selectAllPosts = state => state.posts.posts;

export const selectPostById = (state, postId) =>
    state.posts.posts.find(post => post.id === postId);

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
);