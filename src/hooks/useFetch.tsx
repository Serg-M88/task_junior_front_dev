import {useEffect, useState} from "react";
import axios from "axios";

type FlexibleObject = {
  [key: string]: string | number
}
export type MixedItems = FlexibleObject[]

type StateType = {
  loading: boolean,
  data: MixedItems,
  error: Error | null,
  totalCount: number
}

export const useFetch = (url: string, _page: number): StateType => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setError(null)
    setLoading(true)

    setTimeout(() => {
      axios.get(url, {
        params: {
          _page: _page,
          _per_page: 10
        }
      })
        .then(res => {
          setData(res.data.data)
          setTotalCount(res.data.items)
        })
        .catch(setError)
        .finally(() => setLoading(false))
    }, 1000)

  }, [url, _page])

  return {
    loading,
    data,
    error,
    totalCount
  }
}