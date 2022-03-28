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
            providesTags: ['Post']//массив providesTags в эндпоинтах, это перечисление набора тегов описывающих данные в этой очереди
        }),
        getPost: builder.query({
            query: postId => `/posts/${postId}`
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                //включение всего объекта поста в тело зпроса
                body: initialPost
            }),
            invalidatesTags: ['Post']//invalidatesTags массив эндпоинтов мутаций, пречисление набора тегов, которые признаны недействительными каждый раз, когда мутация запускается
        })
    })
})

//экспорт автоматически сгенерированного хука для эндпоинта `getPosts`
export const { useGetPostsQuery, useGetPostQuery, useAddNewPostMutation } = apiSlice;