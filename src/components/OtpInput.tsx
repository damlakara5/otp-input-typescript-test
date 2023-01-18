import React, { useMemo } from 'react'
import { RE_DIGIT } from '../constants'
import "./OtpInput.css"

export type Props = {
    value: string,
    valueLength: number,
    onChange: (value: string) => void
}

export default function OtpInput({value, valueLength, onChange}: Props) {

    const valueItems = useMemo(() => {
        const valueArray = value.split("")
         // the array should have a length equal to valueLength

         const items: Array<string> = []

        //construct an array from value

        for (let i = 0; i< valueLength ; i++){
            const char = valueArray[i]
            if(RE_DIGIT.test(char)){
                items.push(char)
            }
            else{
                //this way we can always have an array with valueLength
                items.push("")
            }
        }
        return items
       
    } , [value, valueLength])

    const focusToNextInput = (target: HTMLInputElement) => {
        const nextElementSibling = target.nextElementSibling as HTMLInputElement | null

        if(nextElementSibling){
            nextElementSibling.focus()
        }
    }

    const focusToPreviousElement = (target: HTMLInputElement) => {
        const previousElementSibling = target.previousElementSibling as HTMLInputElement | null

        if(previousElementSibling){
            previousElementSibling.focus()
        }
    }


    const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const target = e.target
        let targetValue = e.target.value.trim()
        let isTargetValueDigit = RE_DIGIT.test(targetValue) 

        if(!isTargetValueDigit && targetValue !== ""){
            return
        }

        targetValue = isTargetValueDigit ? targetValue : " "   //12456 => [1,2, ""  ,4,5,6]

        const targetValueLength = targetValue.length

        if(targetValueLength === 1){
            const newValue = value.substring(0, index ) + targetValue +value.substring(index+1)

            onChange(newValue)
    
            if(!isTargetValueDigit){
                return
            }
    
            focusToNextInput(target)
    
        }else if (targetValueLength === valueLength){
            onChange(targetValue)

            target.blur()
        }

       
       
    }
    const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {  //deletion
        const target = e.target as HTMLInputElement
        const targetValue = target.value

        if(e.key === "ArrowRight" || e.key=== "ArrowDown"){
            e.preventDefault()
            return focusToNextInput(target)
        }

        if(e.key === "ArrowLeft" || e.key=== "ArrowUp"){
            e.preventDefault()
            return focusToPreviousElement(target)
        }

        //keep the selection range position
        //if the same digit was typed
        target.setSelectionRange(0, targetValue.length)


        if(e.key !== "Backspace"  || targetValue !== ""){
            return
        }

        focusToPreviousElement(target)
    }

    const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const {target} = e

        target.setSelectionRange(0, target.value.length)

    }

  return (
    <div className='otp-group'>
        {
            valueItems.map((digit, index) => (
                <input  
                    key={index} 
                    type="text"
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    pattern='\d{1}'
                    maxLength={valueLength}
                    className="otp-input"
                    value={digit}
                    onChange={(e) => inputOnChange(e, index)}
                    onKeyDown={inputOnKeyDown}
                    onFocus={inputOnFocus}
                />
            ))
        }
    </div>
  )
}
