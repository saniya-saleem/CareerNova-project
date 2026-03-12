import AppRoutes from "./routes/AppRoute";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;

