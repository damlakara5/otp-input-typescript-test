import {faker} from "@faker-js/faker"
import { screen } from "@testing-library/dom";
import { fireEvent, render } from "@testing-library/react";
import OtpInput, {Props} from "../OtpInput";


describe('<OtpInput />' , () => {
    const renderComponent = (props : Props) => render(<OtpInput {...props} />)
    it('should accept value & valueLength props', () => {//same as test("")
        const value = faker.datatype.number({min:0 , max: 99999  }).toString()
        const valueArray = value.split("")
        const valueLength = value.length


        renderComponent({
            value,
            valueLength,
            onChange: jest.fn()
        })
        

        const inputEls = screen.queryAllByRole("textbox")

        expect(inputEls).toHaveLength(valueLength)

        inputEls.forEach((inputEl, index) => {
            expect(inputEl).toHaveValue(valueArray[index])
        })
    })  

    it("should allow typing of digits" , () => {
        const valueLength = faker.datatype.number({min:2 , max: 6  })
        const onChange = jest.fn()


        renderComponent({
            value: "",
            valueLength,
            onChange
        })

        
        const inputEls = screen.queryAllByRole("textbox")

        expect(inputEls).toHaveLength(valueLength)

        inputEls.forEach((inputEl, index) => {
            const digit = faker.datatype.number({min: 0 , max:9}).toString()

            fireEvent.change(inputEl , {target: {value: digit}})

            
            expect(onChange).toBeCalledTimes(1)
            expect(onChange).toBeCalledWith(digit)


            const inputFocused = inputEls[index + 1] || inputEl

            expect(inputFocused).toHaveFocus()

            onChange.mockReset()
        })
    })

    it("should NOT allow typing of non-digits" , () => {
        const valueLength = faker.datatype.number({min:2 , max: 6  })
        const onChange = jest.fn()


        renderComponent({
            value: "",
            valueLength,
            onChange
        })

        
        const inputEls = screen.queryAllByRole("textbox")

        expect(inputEls).toHaveLength(valueLength)

        inputEls.forEach((inputEl) => {
            const nonDigit = faker.random.alpha()

            fireEvent.change(inputEl , {target: {value: nonDigit}})

            
            expect(onChange).not.toBeCalled()

            onChange.mockReset()
        })
    })

    it("should allow deleting of digits" , () => {
        const value = faker.datatype.number({min:10 , max: 99999  }).toString()
        const valueLength = value.length
        const lastIndx = valueLength -1
        const onChange = jest.fn()


        renderComponent({
            value,
            valueLength,
            onChange,
        })
        

        const inputEls = screen.queryAllByRole("textbox")

        expect(inputEls).toHaveLength(valueLength)

        for(let idx = lastIndx ; idx > -1 ; idx--){
            const inputEl = inputEls[idx]
            const target = {value : ""}

            fireEvent.change(inputEl, {target })
            fireEvent.keyDown(inputEl , {target, key: "Backspace"})


            const valueArray = value.split("")

            valueArray[idx] =  " "

            const expectedValue = valueArray.join("")

            expect(onChange).toBeCalledTimes(1)
            expect(onChange).toBeCalledWith(expectedValue)

            const inputFocused = inputEls[idx - 1] || inputEl

            expect(inputFocused).toHaveFocus()

            onChange.mockReset()
        }

    })

    it('should allow deleting of digits (do NOT focus on previous element)', () => {
        const value = faker.datatype.number({ min: 10, max: 999999 }).toString();
        const valueArray = value.split('');
        const valueLength = value.length;
        const lastIdx = valueLength - 1;
        const onChange = jest.fn();
    
        renderComponent({
          value,
          valueLength,
          onChange,
        });
    
        const inputEls = screen.queryAllByRole('textbox');
    
        expect(inputEls).toHaveLength(valueLength);
    
        for (let idx = lastIdx; idx > 0; idx--) { // idx > 0, because there's no previous input in index 0
          const inputEl = inputEls[idx];
    
          fireEvent.keyDown(inputEl, {
            key: 'Backspace',
            target: { value: valueArray[idx] },
          });
    
          const prevInputEl = inputEls[idx - 1];
    
          expect(prevInputEl).not.toHaveFocus();
    
          onChange.mockReset();
        }
      });

      it('should NOT allow deleting of digits in the middle', () => {
        const value = faker.datatype
          .number({ min: 100000, max: 999999 })
          .toString();
        const valueLength = value.length;
        const onChange = jest.fn();
    
        renderComponent({
          value,
          valueLength,
          onChange,
        });
    
        const inputEls = screen.queryAllByRole('textbox');
        const thirdInputEl = inputEls[2];
        const target = { value: '' };
    
        fireEvent.change(thirdInputEl, { target: { value: '' } });
        fireEvent.keyDown(thirdInputEl, {
          target,
          key: 'Backspace',
        });
    
        expect(onChange).not.toBeCalled();
      });

      it('should allow pasting of digits (same length as valueLength)', () => {
        const value = faker.datatype.number({ min: 10, max: 999999 }).toString(); // minimum 2-digit so it is considered as a paste event
        const valueLength = value.length;
        const onChange = jest.fn();
    
        renderComponent({
          valueLength,
          onChange,
          value: '', // keep the value prop empty to trigger the change event for paste
        });
    
        const inputEls = screen.queryAllByRole('textbox');
    
        // get a random input element from the input elements to paste the digits on
        const randomIdx = faker.datatype.number({ min: 0, max: valueLength - 1 });
        const randomInputEl = inputEls[randomIdx];
    
        fireEvent.change(randomInputEl, { target: { value } });
    
        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith(value);
    
        expect(randomInputEl).not.toHaveFocus();
      });

      it('should NOT allow pasting of digits (less than valueLength)', () => {
        const value = faker.datatype.number({ min: 10, max: 99999 }).toString(); // random 2-5 digit code (less than "valueLength")
        const valueLength = faker.datatype.number({ min: 6, max: 10 }); // random number from 6-10
        const onChange = jest.fn();
    
        renderComponent({
          valueLength,
          onChange,
          value: '',
        });
    
        const inputEls = screen.queryAllByRole('textbox');
        const randomIdx = faker.datatype.number({ min: 0, max: valueLength - 1 });
        const randomInputEl = inputEls[randomIdx];
    
        fireEvent.change(randomInputEl, { target: { value } });
    
        expect(onChange).not.toBeCalled();
      });

      it('should focus to next element on right/down key', () => {
        renderComponent({
          value: '',
          valueLength: 3,
          onChange: jest.fn(),
        });
    
        const inputEls = screen.queryAllByRole('textbox');
        const firstInputEl = inputEls[0];
    
        fireEvent.keyDown(firstInputEl, { key: 'ArrowRight' });
    
        const secondInputEl = inputEls[1];
    
        expect(secondInputEl).toHaveFocus();
    
        fireEvent.keyDown(secondInputEl, { key: 'ArrowDown' });
    
        const thirdInputEl = inputEls[2];
    
        expect(thirdInputEl).toHaveFocus();
      });

      it('should focus to next element on left/up key', () => {
        renderComponent({
          value: '',
          valueLength: 3,
          onChange: jest.fn(),
        });
    
        const inputEls = screen.queryAllByRole('textbox');
        const thirdInputEl = inputEls[2];
    
        fireEvent.keyDown(thirdInputEl, { key: 'ArrowLeft' });
    
        const secondInputEl = inputEls[1];
    
        expect(secondInputEl).toHaveFocus();
    
        fireEvent.keyDown(secondInputEl, { key: 'ArrowUp' });
    
        const firstInputEl = inputEls[0];
    
        expect(firstInputEl).toHaveFocus();
      });

      it('should only focus to input if previous input has value', () => {
        const valueLength = 6;
    
        renderComponent({
          valueLength,
          value: '',
          onChange: jest.fn(),
        });
    
        const inputEls = screen.queryAllByRole('textbox');
        const lastInputEl = inputEls[valueLength - 1];
    
        lastInputEl.focus();
    
        const firstInputEl = inputEls[0];
    
        expect(firstInputEl).toHaveFocus();
      });
})