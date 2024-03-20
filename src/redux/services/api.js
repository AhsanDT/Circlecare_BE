// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { removeAuth } from '../reducer/authSlice'

// Define a service using a base URL and expected endpoints
const baseQuerys = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.token
        if (token) {
            headers.set('Authorization', `bearer ${token}`)
        }
        // headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')
        return headers
    },
})
const fetchBaseQueryWithReAuth = async (args, api, extraOptions) => {
    const result = await baseQuerys(args, api, extraOptions)
    if (result?.error?.status === 401 || result?.error?.data?.code === 401) {
        api.dispatch(removeAuth())
    }
    console.log('result===========', result)
    return result
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQueryWithReAuth,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    tagTypes: ['Questionare', 'Chat'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: `user/login`,
                method: 'POST',
                body: body,
            })
        }),
        getAccessToken: builder.mutation({
            query: (body) => ({
                url: `user/refresh-token`,
                method: 'POST',
                body: body,
            })
        }),
        register: builder.mutation({
            query: (body) => ({
                url: `user/register`,
                method: 'POST',
                body: body,
            })
        }),
        forgot: builder.mutation({
            query: (body) => ({
                url: `user/forgot`,
                method: 'POST',
                body: body,
            })
        }),
        verify: builder.mutation({
            query: (body) => ({
                url: `user/verifyotp`,
                method: 'POST',
                body: body,
            })
        }),
        reset: builder.mutation({
            query: (body) => ({
                url: `user/reset`,
                method: 'PATCH',
                body: body,
            })
        }),
        // sub-admin
        getSubAdmins: builder.query({
            query: () => `user/admin-user-listing`,
        }),
        removeSubAdmins: builder.mutation({
            query: (id) => ({
                url: `user/admin-user-by-id/${id}`,
                method: 'DELETE',
            })
        }),
        // app-user
        getAppUser: builder.query({
            query: () => `user/app-user-listing`,
        }),
        removeAppUser: builder.mutation({
            query: (id) => ({
                url: `user/app-user-by-id/${id}`,
                method: 'DELETE',
            })
        }),
        getDetailAppUser: builder.query({
            query: (id) => `user/app-user-by-id/${id}`,
        }),
        // settings
        getUserInfo: builder.query({
            query: () => `user/admin-user-info`,
        }),
        updateAvatar: builder.mutation({
            query: (body) => ({
                url: `user/admin-update-avatar`,
                method: 'PATCH',
                body: body,
            })
        }),
        updateInfo: builder.mutation({
            query: (body) => ({
                url: `user/admin-update-info`,
                method: 'PATCH',
                body: body,
            })
        }),

        // questionare
        getQuestionare: builder.query({
            query: (id) => `user/questionare`,
            providesTags: ['Questionare']
        }),
        addQuestionare: builder.mutation({
            query: (body) => ({
                url: `user/questionare`,
                method: 'POST',
                body: body,
            })
        }),
        viewQuestionares: builder.query({
            query: (id) => `user/questionare-records/${id}`,
        }),
        viewQuestionare: builder.mutation({
            query: (id) => ({
                url: `user/questionare/${id}`,
                method: 'GET',
            })
        }),
        updateQuestionare: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `user/questionare/${id}`,
                method: 'PATCH',
                body: body,
            })
        }),
        deleteQuestionare: builder.mutation({
            query: (id) => ({
                url: `user/questionare/${id}`,
                method: 'DELETE',
            })
        }),

        // daily task
        getDailyTask: builder.query({
            query: () => `user/dailytask`,
        }),
        addDailyTaskMedia: builder.mutation({
            query: (body) => ({
                url: `user/dailytask_media`,
                method: 'POST',
                body: body,
            })
        }),
        addDailyTask: builder.mutation({
            query: (body) => ({
                url: `user/dailytask`,
                method: 'POST',
                body: body,
            })
        }),
        updateDailyTask: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `user/dailytask/${id}`,
                method: 'PATCH',
                body: body,
            })
        }),
        deleteDailyTask: builder.mutation({
            query: (id) => ({
                url: `user/dailytask/${id}`,
                method: 'DELETE',
            })
        }),
        getDailyTaskDetail: builder.mutation({
            query: (id) => ({
                url: `user/dailytask/${id}`,
                method: 'GET',
            })
        }),

        // articles
        getArticle: builder.query({
            query: () => `user/article`,
        }),
        getArticleDetail: builder.query({
            query: (id) => `user/article/${id}`,
        }),
        addArticle: builder.mutation({
            query: (body) => ({
                url: `user/article`,
                method: 'POST',
                body: body,
            })
        }),
        addArticleMedia: builder.mutation({
            query: (body) => ({
                url: `user/article_media`,
                method: 'POST',
                body: body,
            })
        }),
        updateArticle: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `user/article/${id}`,
                method: 'PATCH',
                body: body,
            })
        }),
        deleteArticle: builder.mutation({
            query: (id) => ({
                url: `user/article/${id}`,
                method: 'DELETE',
            })
        }),

        //          terms
        getPrivacy: builder.query({
            query: () => (`user/privacy-policy`)
        }),
        savePrivacy: builder.mutation({
            query: (body) => ({
                url: `user/privacy-policy`,
                method: 'POST',
                body: body,
            })
        }),
        getTerms: builder.query({
            query: () => (`user/terms-and-conditions`)
        }),
        saveTerms: builder.mutation({
            query: (body) => ({
                url: `user/terms-and-conditions`,
                method: 'POST',
                body: body,
            })
        }),
        getFaq: builder.query({
            query: () => (`user/faq`)
        }),
        saveFaq: builder.mutation({
            query: (body) => ({
                url: `user/faq`,
                method: 'POST',
                body: body,
            })
        }),
        getTutorial: builder.query({
            query: () => (`user/tutorial`)
        }),
        saveTutorial: builder.mutation({
            query: (body) => ({
                url: `user/tutorial`,
                method: 'POST',
                body: body,
            })
        }),

        // dashboard
        getDashboard: builder.query({
            query: () => (`user/dashboard?start_date=2023-01-01&end_date=2023-12-01`)
        }),
        getAllChat: builder.query({
            query: (id) => (`chat/all-chats/${id}`)
        }),
        getActiveUser: builder.query({
            query: () => (`user/activeUsers`)
        }),
        sendFile: builder.mutation({
            query: (body) => ({
                url: `chat/sendFile`,
                method: 'POST',
                body: body,
            })
        }),
        getAllMessage: builder.mutation({
            query: (id) => (`chat/adminChat/${id}`),
            invalidatesTags: ['Chat'],
        }),
        sendMessage: builder.mutation({
            query: (body) => ({
                url: `chat/sendMessage`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Chat'],
        }),
        getUsers: builder.query({
            query: () => (`user/user`)
        }),

    }),
    onError: (error) => {
        console.log('un authorized error');
    },
})

// Export hooks for usage in functional hooks, which are
// auto-generated based on the defined endpoints
export const {
    useLoginMutation,
    useGetAccessTokenMutation,
    useRegisterMutation,
    useForgotMutation,
    useVerifyMutation,
    useResetMutation,


    useGetSubAdminsQuery,
    useRemoveSubAdminsMutation,


    useGetAppUserQuery,
    useRemoveAppUserMutation,
    useGetDetailAppUserQuery,


    useGetUserInfoQuery,
    useUpdateAvatarMutation,
    useUpdateInfoMutation,


    useGetQuestionareQuery,
    useViewQuestionaresQuery,
    useAddQuestionareMutation,
    useViewQuestionareMutation,
    useUpdateQuestionareMutation,
    useDeleteQuestionareMutation,


    useGetDailyTaskQuery,
    useAddDailyTaskMediaMutation,
    useAddDailyTaskMutation,
    useGetDailyTaskDetailMutation,
    useUpdateDailyTaskMutation,
    useDeleteDailyTaskMutation,


    useGetArticleQuery,
    useGetArticleDetailQuery,
    useAddArticleMutation,
    useAddArticleMediaMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,

    useGetPrivacyQuery,
    useSavePrivacyMutation,
    useGetTermsQuery,
    useSaveTermsMutation,
    useGetFaqQuery,
    useSaveFaqMutation,
    useGetTutorialQuery,
    useSaveTutorialMutation,

    useGetDashboardQuery,
    useGetAllChatQuery,
    useGetActiveUserQuery,
    useSendFileMutation,
    useGetAllMessageMutation,
    useSendMessageMutation,

    useGetUsersQuery,
} = api