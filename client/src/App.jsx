import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import AuthorPage from './pages/AuthorPage';
import SearchPage from './pages/SearchPage';
import SingleArticle from './pages/SingleArticle';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Articles from './pages/admin/Articles';
import AddArticle from './pages/admin/AddArticle';
import EditArticle from './pages/admin/EditArticle';
import Categories from './pages/admin/Categories';
import AddCategory from './pages/admin/AddCategory';
import EditCategory from './pages/admin/EditCategory';
import Users from './pages/admin/Users';
import AddUser from './pages/admin/AddUser';
import EditUser from './pages/admin/EditUser';
import Comments from './pages/admin/Comments';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Routes>
      {/* Public Pages with Main Site Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="author/:id" element={<AuthorPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="single/:id" element={<SingleArticle />} />
        <Route path="article/:id" element={<SingleArticle />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Navigate to="/login" replace />} />
      <Route path="/admin/index" element={<Navigate to="/login" replace />} />

      {/* Protected Admin/Author CMS Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Articles Management */}
          <Route path="articles" element={<Articles />} />
          <Route path="article" element={<Navigate to="/admin/articles" replace />} />
          <Route path="articles/create" element={<AddArticle />} />
          <Route path="add-article" element={<Navigate to="/admin/articles/create" replace />} />
          <Route path="articles/edit/:id" element={<EditArticle />} />
          <Route path="update-article/:id" element={<EditArticle />} />

          {/* Comments Moderation */}
          <Route path="comments" element={<Comments />} />

          {/* Admin-only Routes */}
          <Route element={<AdminRoute />}>
            {/* Categories Management */}
            <Route path="categories" element={<Categories />} />
            <Route path="category" element={<Navigate to="/admin/categories" replace />} />
            <Route path="categories/create" element={<AddCategory />} />
            <Route path="add-category" element={<Navigate to="/admin/categories/create" replace />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="update-category/:id" element={<EditCategory />} />

            {/* Users Management */}
            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<AddUser />} />
            <Route path="add-user" element={<Navigate to="/admin/users/create" replace />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="update-user/:id" element={<EditUser />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
