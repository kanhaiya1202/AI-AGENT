import AppRoutes from "./routes/AppRoutes"
import Login from "./screens/Login"

import { UserProvider } from "./context/user.context";


function App() {
  return (
    <>
      < UserProvider>
        <AppRoutes></AppRoutes>
      </ UserProvider>

    </>
  )
}
export default App
