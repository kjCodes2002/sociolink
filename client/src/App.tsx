import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateLinkPage from "./pages/CreateLinkPage";
import LinkPage from "./pages/LinkPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateProfilePage from "./pages/CreateProfilePage";
import PublicRoute from "./components/PublicRoute";
import EditLinkPage from "./pages/EditLinkPage";
import EditProfilePage from "./pages/EditProfilePage";
import { Toaster } from "sonner";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <CreateLinkPage />
              </ProtectedRoute>
            }
          />
          <Route path="/user/:id" element={<LinkPage />} />
          <Route
            path="/user/:id/edit"
            element={
              <ProtectedRoute>
                <EditLinkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newProfile"
            element={
              <ProtectedRoute>
                <CreateProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:id/editProfile"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </>
  );
};

export default App;
