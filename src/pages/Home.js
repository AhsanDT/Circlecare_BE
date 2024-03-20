import React, {useEffect} from 'react';
import DashboardPage from "../components/dashboard";
import {useGetUserInfoQuery} from "../redux/services/api";

const Home = () => {
    const { data, refetch} = useGetUserInfoQuery()

    useEffect(() => {
        refetch()
    }, [])

    return (
        <>
            <DashboardPage />
        </>
    );
};

export default Home;