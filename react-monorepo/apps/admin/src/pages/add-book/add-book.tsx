import { lazy, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Center, useToast } from '@chakra-ui/react'
import { shallow } from 'zustand/shallow'

import { IBook } from '@react-monorepo/types'
import { useBookStore } from '@react-monorepo/stores'
import { useMutateAddBook } from '@react-monorepo/hooks'
import { MESSAGES_ERRORS, MESSAGES_SUCCESS } from '@react-monorepo/utils'

const BookForm = lazy(() => import('@react-monorepo/ui').then((module) => ({ default: module.BookForm })))

const BOOKS_ENDPOINT = import.meta.env.VITE_BOOKS_ENDPOINT

const AddBook = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { addBook } = useBookStore((state) => ({ addBook: state.add }), shallow)
  const { mutate, isSuccess, error, data } = useMutateAddBook()

  useEffect(() => {
    if (isSuccess) {
      addBook(data)
      toast({
        title: MESSAGES_SUCCESS.ADD.TITLE,
        description: `Book ${data.name} have been add successfully.`,
        status: 'success',
      })
      navigate('/')
    }

    if (error instanceof Error)
      toast({
        title: error.message,
        description: MESSAGES_ERRORS.ACTION_FAIL,
        status: 'error',
      })
  }, [addBook, data, error, isSuccess, navigate, toast])

  const handleOnSubmit = useCallback(
    (values: IBook) => {
      mutate({
        path: BOOKS_ENDPOINT,
        values: values,
      })
    },
    [mutate]
  )

  return (
    <Center mt={10} px={5}>
      <BookForm onSubmit={handleOnSubmit} />
    </Center>
  )
}

export default AddBook
