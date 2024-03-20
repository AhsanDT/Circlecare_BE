import AppRoute from "./routes/AppRoute";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
        <Toaster
            position="top-center"
            reverseOrder={false}
        />
        <AppRoute />
    </>
  );
}

export default App;
