import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuth = useSelector(state => state?.auth?.isAuth);

    return isAuth ? <Component {...rest} /> : <Navigate to="/auth/login" replace={true} />
};

export default PrivateRoute;