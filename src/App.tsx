import './App.css'
import {Box, Button, Flex, Spinner, Text, useColorModeValue, useDisclosure} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {MixedItems, useFetch} from "./hooks/useFetch.tsx";
import {useInView} from "react-intersection-observer";
import TabularList from "./components/TabularList.tsx";
import {ModalAddItems} from "./components/Modal.tsx";

function App() {
  const url = 'http://localhost:3000/empty'
  const [data, setData] = useState<MixedItems>([])
  const [page, setPage] = useState<number>(1)
  const {data: resData, loading, error, totalCount} = useFetch(url, page)
  const {ref, inView} = useInView({
    threshold: 1
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bg = useColorModeValue('white', 'gray.800')

  const isFetching = useMemo(()=> {
    return +totalCount > data.length
  }, [data, totalCount])

  useEffect(() => {
    if (resData && isFetching) {
      setData(prev => [...prev, ...resData])
    }
  }, [resData])

  useEffect(() => {
    if (data && inView) {
      setPage(prev => prev + 1)
    }
  }, [inView, data])

  return (
    <>
      <Flex direction={'column'}>
        <Box py={5} top={0} bg={bg} position={'sticky'}>
          <Button width={'100%'} onClick={onOpen} colorScheme={'cyan'}>Добавить запись</Button>
        </Box>
        <ModalAddItems isOpen={isOpen} onClose={onClose} data={data} setData={setData} totalCount={totalCount} url={url}/>
        {data.length === 0 && loading && <Spinner mx={'auto'} mt={20}/>}
        {data.length > 0 && <TabularList data={data} loading={loading}/>}
        {!loading && !error && isFetching && <Box ref={ref} style={{height: '10px', marginTop: '200px'}}/>}
        {data.length === 0 && !loading && !error && <Text mt={20}>Нет данных</Text>}
        {error && <Text mt={20}>{error.message}</Text>}
      </Flex>
    </>
  )
}

export default App
