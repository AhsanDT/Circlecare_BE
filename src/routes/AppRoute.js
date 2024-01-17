import React, { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AuthLayout from "../components/auth/AuthLayout";
import Layout from "../components/layout";

import Login from "../pages/Login";
import Recover from "../pages/Recover";
import Verify from "../pages/Verify";
import CreatePassword from "../pages/CreatePassword";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import SubAdmin from "../pages/SubAdmin";
import UserList from "../pages/UserList";
import UserListDetail from "../pages/UserListDetail";
import Questionnaire from '../pages/Questionnaire';
import AddQuestionnaire from "../pages/AddQuestionnaire";
import RecordQuestionnaire from "../pages/RecordQuestionnaire";
import DailyTask from "../pages/DailyTask";
import AddDailyTask from "../pages/AddDailyTask";
import Setting from "../pages/Setting";
import Article from "../pages/Article";
import AddArticle from "../pages/AddArticle";
import EditQuestionnairePage from "../components/questionnaire/EditQuestionnairePage";
import Guidlines from "../pages/Guidelines";
import EditArticlePage from "../components/article/EditDetailyTaskPage";
import EditDetailyTaskPage from '../components/dailyTask/EditDetailyTaskPage';
import Support from "../components/support";
import Privacy from "../pages/Privacy";

const AppRoute = () => {
    const navigate = useNavigate()
    const token = useSelector(state => state?.auth?.token);

    const checkToken = () => {
        return token !== null && token !== undefined && token !== '';
    }
    return (
        <>
            <Routes>

                <Route path="/auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to={{ pathname: "/auth/login" }} />} />
                    <Route path="login" element={<Login />} />
                    <Route path="recover" element={<Recover />} />
                    <Route path="verify" element={<Verify />} />
                    <Route path="create-password" element={<CreatePassword />} />
                    <Route path="sign-up" element={<SignUp />} />
                </Route>
                <Route path="/privacy" element={<Privacy />} />

                <Route path="/" element={<Layout />}>
                    <Route index element={<>{checkToken() ? <Home /> : <Navigate to={{ pathname: "/auth/login" }} />}</>} />

                    <Route path="sub-admin" element={<SubAdmin />} />

                    <Route path="user-list" element={<Outlet />} >
                        <Route index element={<UserList />} />
                        <Route path=":id" element={<UserListDetail />} />
                    </Route>

                    <Route path="questionnaire" element={<Outlet />} >
                        <Route index element={<Questionnaire />} />
                        <Route path="add-new" element={<AddQuestionnaire />} />
                        <Route path="edit/:id" element={<EditQuestionnairePage />} />
                        <Route path="record/:id" element={<RecordQuestionnaire />} />
                    </Route>

                    <Route path="daily-task" element={<Outlet />} >
                        <Route index element={<DailyTask />} />
                        <Route path="add-new" element={<AddDailyTask />} />
                        <Route path="edit/:id" element={<EditDetailyTaskPage />} />
                    </Route>

                    <Route path="article" element={<Outlet />}>
                        <Route index element={<Article />} />
                        <Route path="add-new" element={<AddArticle />} />
                        <Route path="edit/:id" element={<EditArticlePage />} />
                    </Route>

                    <Route path="guidelines" element={<Guidlines />} />

                    <Route path="setting" element={<Setting />} />
                    <Route path="support" element={<Support />} />
                </Route>

            </Routes>
        </>
    );
};

export default AppRoute;