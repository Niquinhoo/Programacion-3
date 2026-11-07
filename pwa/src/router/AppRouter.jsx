import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';

export default createBrowserRouter([{ element: <MainLayout />, children: [
  { path: '/', element: null },
  { path: '/expenses', element: null },
  { path: '/expenses/:id', element: null },
  { path: '/settings', element: null },
  { path: '*', element: <Navigate to="/" replace /> },
] }]);
