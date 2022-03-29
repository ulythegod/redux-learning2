import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//Your application is expected to have only one createApi call in it

//Определяется один объект API-слайс
export const apiSlice = createApi({
    //редюсер кэша ошидажет добавления в `state.api` (уже по умолчанию - это опционально)
    reducerPath: 'api',
    //все редюсеры будут иметь url начинающийся с '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    tagTypes: ['Post'],//кореневое поле tagTypes в объекте, определеяет массив строковых имен тегов для типов данных
    //эндпоинты представляют операции и запросы на этот сервер
    endpoints: builder => ({
        //эндпоинт `getPosts` это операция-"очередь", которая возвращает данные
        getPosts: builder.query({
            //url запроса - '/fakeApi/posts'
            query: () => '/posts',
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({id}) => ({type: 'Post', id}))
            ]//массив providesTags в эндпоинтах, это перечисление набора тегов описывающих данные в этой очереди
        }),
        getPost: builder.query({
            query: postId => `/posts/${postId}`,
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                //включение всего объекта поста в тело зпроса
                body: initialPost
            }),
            invalidatesTags: ['Post']//invalidatesTags массив эндпоинтов мутаций, пречисление набора тегов, которые признаны недействительными каждый раз, когда мутация запускается
        }),
        editPost: builder.mutation({
            query: post => ({
                url: `/posts/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reaction }) => ({
                url: `posts/${postId}/reactions`,
                method: 'POST',
                //в рельном приложении возможно стоило бы использовать user ID,
                //чтобы один и тот же пользователь не мог поставить одну реакцию дважды
                body: {reaction}
            }),
            async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
                //`updateQueryData` требует имя эндпоинта и закэшированные ключевые аргументы
                //так что он будет знать, какую часть кэша состояния нужно обновлять
                const patchResult = dispatch(
                    //updateQueryData использует Immer, так что вы можете изменять скопированные закэшированные данные
                    apiSlice.util.updateQueryData('getPost', undefined, draft => {
                        //`draft` -  Immer-обертка и она может быть изменена как в createSlice
                        const post = draft.find(post => post.id === postId);
                        if (post) {
                            post.reactions[reaction]++
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

//экспорт автоматически сгенерированного хука для эндпоинта `getPosts`
export const { 
    useGetPostsQuery, 
    useGetPostQuery,
    useAddNewPostMutation,
    useEditPostMutation,
    useAddReactionMutation
} = apiSlice;

console.log(apiSlice);