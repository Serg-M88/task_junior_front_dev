import {Spinner, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {MixedItems} from "../hooks/useFetch.tsx";

type PropsType = {
  data: MixedItems,
  loading: boolean
}

function TabularList({data, loading}: PropsType) {

  const columnTitle = Object.keys(data[0])

  return (
    <>{
      <TableContainer>
        <Table variant='simple' size={'sm'} >
          <TableCaption placement={'top'} textAlign={'left'}>Junior front-end developer (React)</TableCaption>
          <Thead>
            <Tr>
              {columnTitle!.map((title, index) => <Th key={index}>{title}</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, index) => {
              const values = Object.values(row)
              return <Tr key={index}>
                {values.map((value, index) => {
                    if (typeof value === 'object') {
                      return <Td key={index}>Это объект</Td>
                    }
                    return <Td key={index} style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}>{value}</Td>
                  }
                )}
              </Tr>
            })}
          </Tbody>
        </Table>
        {loading && <Spinner mx={'auto'} my={20}/>}
      </TableContainer>
    }
    </>
  )
}

export default TabularList