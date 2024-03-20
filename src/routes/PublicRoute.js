import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => {
    const isAuth = useSelector(state => state?.auth?.isAuth);

    return isAuth ? <Navigate to="/" replace={true} /> : <Component {...rest} />
};

export default PublicRoute;