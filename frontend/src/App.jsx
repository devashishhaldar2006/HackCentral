import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./lib/appStore";
import LoginPage from "./pages/LoginPage";
import Body from "./components/Body";
import HomePage from "./pages/HomePage";
function App() {
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Body />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<LoginPage />} />
    </Routes>
    </BrowserRouter>
    </Provider>
    </>
  );}

export default App;
