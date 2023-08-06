'use client'
import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

const Test = <Value extends PropertyKey, Zizi extends PropertyKey>(
  props: PropsWithChildren<{
    name: Zizi
    setName: Dispatch<SetStateAction<Zizi>>
    value: Value
    setValue: Dispatch<SetStateAction<Value>>
  }>
) => {
  console.log(props)
  return <h1>Hello world !</h1>
}

const page = () => {
  const [value, setValue] = useState<string>('')
  const [name, setName] = useState(0)

  return (
    <Test name={name} setName={setName} value={value} setValue={setValue}>
      page
    </Test>
  )
}

export default page
