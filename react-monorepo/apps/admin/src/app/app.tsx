import { Suspense, lazy, useMemo } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FiHome, FiPlus } from 'react-icons/fi'
import { shallow } from 'zustand/shallow'
import { AbsoluteCenter, Box, ChakraProvider, Spinner } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useUserStore } from '@react-monorepo/shared/stores'
import { ISideBarItem } from '@react-monorepo/shared/types'
import { COLORS } from '@react-monorepo/shared/utils'

const BookDetail = lazy(() => import('@react-monorepo/shared/ui').then((module) => ({ default: module.BookDetail })))
const Dashboard = lazy(() => import('@react-monorepo/shared/ui').then((module) => ({ default: module.Dashboard })))
const LoginPage = lazy(() => import('@react-monorepo/shared/ui').then((module) => ({ default: module.LoginPage })))
const RegisterPage = lazy(() => import('@react-monorepo/shared/ui').then((module) => ({ default: module.RegisterPage })))

const AdminDashboard = lazy(() => import('../pages').then((module) => ({ default: module.AdminDashboard })))
const EditBookPage = lazy(() => import('../pages').then((module) => ({ default: module.EditBookPage })))
const AddBookPage = lazy(() => import('../pages').then((module) => ({ default: module.AddBookPage })))
const EditMemberPage = lazy(() => import('../pages').then((module) => ({ default: module.EditMemberPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 10 },
  },
})

export const App = () => {
  const { loginUser } = useUserStore((state) => ({ loginUser: state.loginUser }), shallow)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider toastOptions={{ defaultOptions: { position: 'bottom', duration: 3000, isClosable: true } }}>
        <Suspense fallback={<OverlayLoading />}>
          <Routes>
            {loginUser ? (
              <Route path="/*" element={<PrivateRoutes />} />
            ) : (
              <Route path="/*" element={<PublicRoutes />} />
            )}
          </Routes>
        </Suspense>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

const PublicRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="*" element={<Navigate to="login" />} />
  </Routes>
)

const PrivateRoutes = () => {
  const sidebarContent: ISideBarItem[] = useMemo(
    () => [
      { name: 'Home', icon: FiHome, href: 'dashboard' },
      { name: 'Add book', icon: FiPlus, href: 'add-book' },
    ],
    []
  )

  return (
    <Routes>
      <Route path="/admin" element={<Dashboard sidebar={sidebarContent} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="add-book" element={<AddBookPage />} />
        <Route path="edit-book/:bookId" element={<EditBookPage />} />
        <Route path="edit-member/:userId" element={<EditMemberPage />} />
        <Route path="books/:bookId" element={<BookDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="admin/dashboard" />} />
    </Routes>
  )
}

const OverlayLoading = () => (
  <Box position="relative" h="100vh" bgColor={COLORS.BLACK} opacity={0.5}>
    <AbsoluteCenter axis="both">
      <Spinner thickness="4px" speed="0.65s" color={COLORS.PRIMARY} size="xl" />
    </AbsoluteCenter>
  </Box>
)
