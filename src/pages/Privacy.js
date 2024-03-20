import React, { useEffect } from 'react';
import {useGetPrivacyQuery} from "../redux/services/api";

const Privacy = () => {
    const {data, refetch, isLoading: isFetching} = useGetPrivacyQuery()

    isFetching && <>Loading...</>

    useEffect(() => {
        refetch();
    }, []);
    return (
        <>
            <div className="container my-5">
                <div dangerouslySetInnerHTML={{ __html: data?.data[0]?.text }} />
            </div>
        </>
    );
};

export default Privacy;