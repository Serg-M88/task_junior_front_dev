import {
  Button,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useToast
} from "@chakra-ui/react";
import * as React from "react";
import {useEffect, useState} from "react";
import {MixedItems} from "../hooks/useFetch.tsx";
import axios from "axios";

type PropsType = {
  isOpen: boolean,
  onClose: () => void,
  data: MixedItems,
  setData: React.Dispatch<React.SetStateAction<MixedItems>>,
  totalCount: number,
  url: string
}

type inputType = {
  label: string,
  value: string,
  isInvalid?: boolean
}

export function ModalAddItems({isOpen, onClose, data, setData, totalCount, url}: PropsType) {
  const [inputsData, setInputsData] = useState<inputType[]>([])
  const [isDuplicateInputValue, setIsDuplicateInputValue] = useState(false)
  const [newInputValue, setNewInputValue] = useState('')
  const [isDisabledInputElBtn, setIsDisabledInputElBtn] = useState(true)
  const [formIsCreated, setFormIsCreated] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (data.length > 0) {
      const labels = Object.keys(data[0]).filter(key => key !== 'id');
      setInputsData(labels.map(label => ({label, value: '', isInvalid: false})))
      setFormIsCreated(true)
    }
  }, [data])

  useEffect(() => {
    const newInputsData = inputsData.map(input => {
      input.value = ''
      input.isInvalid = false
      return input
    })
    setInputsData(newInputsData)
  }, [isOpen])

  function buttonHandlerCancel() {
    onClose()
  }

  function isNotEmptyValue(value: string): boolean {
    return value.trim() !== ''
  }

  function inputsValidation(inputsData: inputType[]): boolean {
    let isValid = true
    const newInputData = inputsData.map(input => {
      if (!isNotEmptyValue(input.value)) {
        input.isInvalid = true
        isValid = false
      } else {
        input.isInvalid = false
      }
      console.log(input)
      return input
    })
    setInputsData(newInputData)
    return isValid
  }

  function buttonHandlerAdd() {
    console.log('Button handler add')
    if (inputsValidation(inputsData)) {

      const formData = inputsData.reduce<Record<string, string | number>>((acc, input) => {
        acc[input.label] = input.value
        return acc
      }, {})

      axios.post(url, formData)
        .then(res => {
          console.log(res)
          if (totalCount <= data.length) setData(prevState => [...prevState, res.data])
          onClose()
          toast({
            position: 'bottom',
            title: 'Запись добавлена',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        })
        .catch(error => {
          toast({
            position: 'bottom',
            title: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        })
    }

  }

  const handleInputChange = (index: number, newValue: string) => {
    console.log(inputsData)
    setInputsData(prevInputs => {
      const updateInputs = [...prevInputs]
      updateInputs[index] = {...updateInputs[index], value: newValue, isInvalid: false}
      return updateInputs
    })
  }

  useEffect(() => {
  }, [isOpen])

  function addNewInputEl() {
    setInputsData(prevState => [...prevState, {value: '', label: newInputValue, isInvalid: false}])
    setNewInputValue('')
    setIsDisabledInputElBtn(true)
    toast({
      position: 'bottom',
      title: 'Поле добавлено',
      status: 'success',
      duration: 5000,
      isClosable: true
    })
    console.log(inputsData)
  }

  function newInputElChange(newValue: string) {
    const filteredValue = newValue.replace(/[^a-zA-Z0-9]/g, '')
    const exists = inputsData.some(item => item.label === newValue)
    setIsDuplicateInputValue(false)
    if (isNotEmptyValue(newValue) && !exists) {
      setIsDisabledInputElBtn(false)
    } else if(exists){
      setIsDuplicateInputValue(true)
      setIsDisabledInputElBtn(true)
    }else {
      setIsDisabledInputElBtn(true)
    }
    setNewInputValue(filteredValue)
  }

  function createdForm() {
    setFormIsCreated(true)
    toast({
      position: 'bottom',
      title: 'Форма успешно создана!',
      status: 'success',
      duration: 5000,
      isClosable: true
    })
  }

  function createdFormCancel() {
    setInputsData([])
    toast({
      position: 'bottom',
      title: 'Все поля были удалены',
      status: 'info',
      duration: 5000,
      isClosable: true
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay/>
      {formIsCreated
        ? <ModalContent>
          <ModalHeader color={'gray.400'}>Добавить запись</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            {inputsData.length !== 0
              ? inputsData.map((input, index) => {
                if (input.label === 'id') return null
                return <FormControl key={index} mb={3}>
                  <Text>{input.label}</Text>
                  <Input
                    type={'text'}
                    value={input.value}
                    onChange={e => handleInputChange(index, e.target.value)}
                    isInvalid={input.isInvalid}
                  />
                  {input.isInvalid && <Text fontSize={'xs'} color={'indianred'}>Поле не заполнено</Text>}
                </FormControl>
              })
              : 'нет данных'
            }
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='cyan' mr={3}
              onClick={buttonHandlerAdd}
            >Добавить</Button>
            <Button
              onClick={buttonHandlerCancel}
            >Отмена</Button>
          </ModalFooter>
        </ModalContent>
        : <ModalContent>
          <ModalHeader color={'gray.400'}>Создание полей формы</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>

            {inputsData.length !== 0
              ? inputsData.map((input, index) => {
                if (input.label === 'id') return null
                return <FormControl key={index} mb={3}>
                  <HStack>
                    <Text fontSize={'xs'} opacity={0.3}>{input.label}</Text>
                    <Spacer/>
                    <Input
                      size={'xs'}
                      type={'text'}
                      value={input.value}
                      placeholder={input.label}
                      disabled={true}
                    />
                  </HStack>
                  {input.isInvalid && <Text fontSize={'xs'} color={'indianred'}>Поле не заполнено</Text>}
                </FormControl>
              })
              : <Text opacity={0.3}>Поля не добавлены</Text>}

            {inputsData.length < 15 &&
              <FormControl>
                <Text>Название нового поля</Text>
                <HStack>
                  <Input
                    type={'text'}
                    value={newInputValue}
                    onChange={e => newInputElChange(e.target.value)}
                    placeholder={'Вводите только латинские буквы'}
                  />
                  <Button onClick={addNewInputEl} isDisabled={isDisabledInputElBtn}>Добавить</Button>
                </HStack>
                {isDuplicateInputValue
                  ? <Text fontSize={'xs'} mx={'auto'} color={'indianred'}>Данное поле существует</Text>
                  : <Text fontSize={'xs'} mx={'auto'} opacity={0.5}>Внимание! Минимальное количество
                    полей для формы должно быть 5</Text>
                }
              </FormControl>}

          </ModalBody>
          <ModalFooter flexDirection={'column'} mb={10}>

            {inputsData.length >= 5 &&
              <HStack>
                <Button
                  colorScheme='cyan' mr={3}
                  onClick={createdForm}
                >Создать форму</Button>
                <Button
                  onClick={createdFormCancel}
                >Очистить поля</Button>
              </HStack>}
          </ModalFooter>
        </ModalContent>
      }
    </Modal>
  )
}