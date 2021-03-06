
import { Component, OnInit } from '@angular/core';
import { PW1FormData } from '../pw1-form-data';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkerDataService } from '../worker-data.service';

@Component({
  selector: 'app-pw1-form-main',
  templateUrl: './pw1-form-main.component.html',
  styleUrls: ['./pw1-form-main.component.css']
})
export class PW1FormMainComponent implements OnInit {
  iDescription_MaxLength: number = 100;
  iDetail_MaxLength: number = 25;

  PW1_data: PW1FormData = new PW1FormData();

  PW1_dateTimeRef: any;
  PW1_dateTimeError: string = '';
  bPrice_WasThousChar_LeftCaretSide: boolean;
  bPrice_WasDecChar_LeftCaretSide: boolean;
  bPrice_WasThousChar_RightCaretSide: boolean;
  bPrice_WasDecChar_RightCaretSide: boolean;
  iPrice_LastCaretPos: number;

  avatarOpacity: number = 0;
  avatarImg: string = '';

  PW1_form: FormGroup;

  constructor(private builder: FormBuilder, public PW1_WorkerData: WorkerDataService) { }

  ngOnInit() {
    this.PW1_form = this.builder.group({
      description: ['', (val: any) => { return (((val.value || '').length > 0)? null : {'error': 'La descrizione è necessaria.'}) }],
      detail: [''],
      date: ['', (val: any) => {return this.PW1_validateDate()}],
      time: ['', (val: any) => {return this.PW1_validateDate()}],
      price: ['', (val: any) => {return ((((val.value || '').length > 0) && (val.value != '-'))? null : {'error': 'Il prezzo è necessario.'})}],
      worker: ['', (val: any) => {return this.PW1_validateWorker(val.value)}]
    });

    //Trigger the resize event, so that it will auto-center on init
    window.dispatchEvent(new Event('resize'));
  }

  onSubmit()
  {
    this.PW1_WorkerData.sendData(this.PW1_data);
  }

  onResize(divRef: any)
  {
    var
      iWidth: number = (window.innerWidth-divRef.getBoundingClientRect().width)/2,
      iHeight: number = (window.innerHeight-divRef.getBoundingClientRect().height)/2;

    if (iWidth < 0)
    {
      divRef.style.marginLeft = '0px';
    }else
    {
      divRef.style.marginLeft = iWidth+'px';
    }
    if (iHeight < 0)
    {
      divRef.style.marginTop = '0px';
    }else
    {
      divRef.style.marginTop = iHeight+'px';
    }
  }

  private ParseString(sStr: string, iQty: number): string[]
  {
    var
      sChar: any,
      aResult: string[];

    aResult = ['', ''];
    for (sChar of sStr)
    {
      if (isNaN(sChar))
      {
        aResult.push('');
      }else
      {
        aResult[aResult.length-1] += sChar;
      }
    }
    aResult[0] = ((aResult.length == (iQty+1))? 'ok' : '');

    return aResult;
  }

  PW1_CheckValidState(...sElements: string[]): number
  {
    var
      i: number,
      iResult: number = 1;

    for (i = 0; i < sElements.length; i++)
    {
      if (this.PW1_form.get(sElements[i]).dirty)
      {
        if (this.PW1_form.get(sElements[i]).errors != null)
        {
          iResult = 0;
        }
      }else
      {
        return -1;
      }
    }

    return iResult;
  }

  private EncodeDate(sDate: string, sTime: string): void
  {
    //Get the values as an array; [0] is if the process was successful
    var
      aDate: string[] = this.ParseString(sDate || '', 3),
      aTime: string[] = this.ParseString(sTime || '', 2);

    if ((aDate[0].length > 0) && (aTime[0].length > 0))
    {
      this.PW1_data.date = aDate[1]+'-'+aDate[2]+'-'+aDate[3]+'T'+aTime[1]+':'+aTime[2]+':00'; //"2019-10-21T10:00:00"
    }else
    {
      this.PW1_data.date = '';
    }
  }

  private setDatetimeBorder(bsetValid: number)
  {
    if (bsetValid < 0)
    {
      this.PW1_dateTimeRef[0].style.borderColor = 'rgba(0, 0, 0, 255)';
      this.PW1_dateTimeRef[1].style.borderColor = 'rgba(0, 0, 0, 255)';
      this.PW1_dateTimeRef[1].style.borderRightWidth = '1px';
      this.PW1_dateTimeRef[1].style.borderTopRightRadius = '0px';
      this.PW1_dateTimeRef[1].style.borderBottomRightRadius = '0px';
    }else
    {
      if (bsetValid > 0)
      {
        this.PW1_dateTimeRef[0].style.borderColor = 'rgba(0, 255, 0, 255)';
        this.PW1_dateTimeRef[1].style.borderColor = 'rgba(0, 255, 0, 255)';
      }else
      {
        this.PW1_dateTimeRef[0].style.borderColor = 'rgba(255, 0, 0, 255)';
        this.PW1_dateTimeRef[1].style.borderColor = 'rgba(255, 0, 0, 255)';
      }

      this.PW1_dateTimeRef[1].style.borderRightWidth = '20px';
      this.PW1_dateTimeRef[1].style.borderTopRightRadius = '9px';
      this.PW1_dateTimeRef[1].style.borderBottomRightRadius = '9px';
    }
  }

  PW1_validateDate(): any
  {
    var
      oDate: any,
      oNow: any,
      bIsValid: boolean = false,
      aArr: any[];

    //Save the input in PW1_data.date
    this.EncodeDate(this.PW1_form ? this.PW1_form.get('date').value : '', this.PW1_form ? this.PW1_form.get('time').value : '');

    //Get the values in PW1_data.date as an array; [0] is if the process was successful
    aArr = this.ParseString((this.PW1_data.date || ''), 6);

    if (aArr[0].length > 0)
    {
      oNow = new Date();
      oDate = new Date(aArr[1], aArr[2]-1, aArr[3], aArr[4], aArr[5], aArr[6]);

      bIsValid = (oDate.getTime() > oNow.getTime());
    }

    if (this.PW1_dateTimeRef)
    {
      if (bIsValid) //Is true only if all of the requirements are met
      {
        this.setDatetimeBorder(1);

        //We need to set both forms as valid! Also, no need to check for PW1_form: it wouldn't be valid otherwise
        this.PW1_form.get('date').setErrors(null);
        this.PW1_form.get('time').setErrors(null);

        this.PW1_dateTimeError = '';
        return null;
      }else
      {
        if (this.PW1_form && this.PW1_form.get('date').dirty && this.PW1_form.get('time').dirty)
        {
          this.setDatetimeBorder(0);

          if (aArr[0].length > 0)
          {
            this.PW1_dateTimeError = 'Il passato è irreversibile';
          }else
          {
            this.PW1_dateTimeError = 'Data non valida';
          }
        }else
        {
          //Nothing to see here...
          this.setDatetimeBorder(-1);

          this.PW1_dateTimeError = '';
        }

        return {'error': 'La data è necessaria.' };
      }
    }else
    {
      this.PW1_dateTimeError = '';
      return {'error': 'La data è necessaria.' };
    }
  }

  PW1_KeyUpPrice(val :any)
  {
    //Record some data: we're going to need it to handle chars being deleted
    var
      sDecimalChar = (1.1).toLocaleString(),
      sThousandChar = (1000).toLocaleString();

    sDecimalChar = sDecimalChar.substring(1, sDecimalChar.length-1);
    sThousandChar = sThousandChar.substring(1, sThousandChar.length-3);

    this.bPrice_WasThousChar_LeftCaretSide = (val.value[val.selectionStart-1] && (val.value[val.selectionStart-1] == sThousandChar));
    this.bPrice_WasDecChar_LeftCaretSide = (val.value[val.selectionStart-1] && (val.value[val.selectionStart-1] == sDecimalChar));
    this.bPrice_WasThousChar_RightCaretSide = (val.value[val.selectionStart] && (val.value[val.selectionStart] == sThousandChar));
    this.bPrice_WasDecChar_RightCaretSide = (val.value[val.selectionStart] && (val.value[val.selectionStart] == sDecimalChar));

    //Ignore the negative sign
    if ((val.value.length > 0) && (val.value[0] == '-'))
    {
      this.iPrice_LastCaretPos = val.selectionStart-1;
    }else
    {
      this.iPrice_LastCaretPos = val.selectionStart;
    }
  }

  PW1_FocusInOutPrice(bFocusOut: boolean)
  {
    //Yeah, how about no. It's fine while you're writing it, but not if you leave it like this.
    var
      sTxt = this.PW1_form.get('price').value;

    if ((sTxt == '') || (sTxt == '-'))
    {
      if (bFocusOut)
      {
        this.PW1_form.get('price').markAsDirty();
      }else
      {
        this.PW1_form.get('price').markAsPristine();
      }
    }
  }

  PW1_ValidatePrice(val: any) //Doesn't actually validate anything; it is instead passed onInput, so that we can use the element ref to fix its value on the fly
  {
    var
      i: number, iTemp: number, iCaret: number,
      sTemp: string, sResult: string,
      sTxt: any = val.value,
      aArr: string[] = [''],
      sDecimalChar = (1.1).toLocaleString(),
      sThousandChar = (1000).toLocaleString();

    if ((sTxt.length > 0) && (sTxt != '-'))
    {
      sDecimalChar = sDecimalChar.substring(1, sDecimalChar.length-1);
      sThousandChar = sThousandChar.substring(1, sThousandChar.length-3);

      sResult = '';

      //New caret pos - will refine it along the way
      iCaret = val.selectionStart;

      //Parse the input's value
      for (i = 0; i < sTxt.length; i++)
      {
        if (isNaN(sTxt[i]))
        {
          if (sTxt[i] == sDecimalChar)
          {
            //Was a decimal char
            if (aArr.length < 2)
            {
              aArr.push('');
            }else
            {
              //Wasn't the first one; ignore it and adjust the caret
              if (i < val.selectionStart)
              {
                iCaret -= 1;
              }
            }
          }else if ((i == 0) && (sTxt[i] == '-'))
          {
            //Was the sign
            sResult = '-';
          }else
          {
            //Was something else; ignore it and adjust the caret
            if (i < val.selectionStart)
            {
              iCaret -= 1;
            }
          }
        }else
        {
          aArr[aArr.length-1] += sTxt[i];
        }
      }

      //Something was deleted: determine what it was and act accordingly
      if (this.PW1_data.price && (this.PW1_data.price.length == (sTxt.length+1)))
      {
        //sDecimalChar was deleted on the left
        if (this.bPrice_WasDecChar_LeftCaretSide && (val.value[val.selectionStart-1] != sDecimalChar))
        {
          //Remove the last 2 digits from aArr[0] and add them as aArr[1]
          aArr.push(aArr[0][aArr[0].length-2]+''+aArr[0][aArr[0].length-1]);
          aArr[0] = aArr[0].substring(0, aArr[0].length-2);
        }

        //sThousandChar was deleted on the left
        if (this.bPrice_WasThousChar_LeftCaretSide && (val.value[val.selectionStart-1] != sThousandChar))
        {
          //Adjust the caret
          if (iTemp)
          {
            iTemp -= 1;
          }else
          {
            iTemp = -1;
          }
        }

        //sDecimalChar was deleted on the right
        if (this.bPrice_WasDecChar_RightCaretSide && (val.value[val.selectionStart] != sDecimalChar))
        {
          //Remove the last 2 digits from aArr[0] and add them as aArr[1]
          aArr.push(aArr[0][aArr[0].length-2]+''+aArr[0][aArr[0].length-1]);
          aArr[0] = aArr[0].substring(0, aArr[0].length-2);

          //Adjust the caret
          iCaret +=1;
        }

        //Something was deleted on the left, while on the right there is and was an sThousandChar
        if (this.bPrice_WasThousChar_RightCaretSide && (val.value[val.selectionStart] == sThousandChar))
        {
          //Adjust the caret
          if (iTemp)
          {
            iTemp -= 1;
          }else
          {
            iTemp = -1;
          }
        }

        //Something was deleted on the left, while on the right there is and was an sDecimalChar and there were no integers
        if ((aArr[0].length <= 0) && this.bPrice_WasDecChar_RightCaretSide && (val.value[val.selectionStart] == sDecimalChar))
        {
          //Adjust the caret
          if (iTemp)
          {
            iTemp -= 1;
          }else
          {
            iTemp = -1;
          }
        }
      }

      //Concatenate the integers (if they exist)
      sTemp = '';
      if (!iTemp) //iTemp might have been assigned when detecting that sThousandChar (or something else) was deleted on the left
      {
        iTemp = 0; //Counts the sThousandChars added to the left of the current iCaret
      }
      if (aArr[0].length > 0)
      {
        //They exist: add them, and also inject sThousandChar
        for (i = aArr[0].length-1; i >= 0; i--)
        {
          if ((i < (aArr[0].length-1)) && (((aArr[0].length-i-1)%3) == 0))
          {
            sTemp = sThousandChar+sTemp;

            //Adjust the caret if needed
            if (iCaret > (sResult.length+i))
            {
              iTemp +=1;
            }
          }
          sTemp = aArr[0][i]+sTemp;
        }
      }else
      {
        sTemp += '0';
        
        if (aArr.length < 2)
        {
          iTemp +=2; //The user just wrote something different from the sDecChar
        }else
        {
          iTemp +=1; //The user just wrote the sDecChar
        }
      }
      sResult += sTemp;
      iCaret += iTemp;

      //Concatenate the decimals (+ make sure that they exist)
      if (aArr.length < 2)
      {
        aArr.push('00');
      }
      while (aArr[1].length < 2)
      {
        aArr[1] += '0';
      }
      sResult += sDecimalChar+aArr[1][0]+aArr[1][1]; //Max 2 decimal positions

      //Save the parsed price and restore the caret
      val.value = sResult;

      val.selectionStart = iCaret;
      val.selectionEnd = iCaret;

      //Also save the value
      this.PW1_data.price = sResult;

      /*
      //This would save it as a number instead of as a string
      this.PW1_data.price = Number(aArr[0])+(Number(aArr[1][0])/10)+(Number(aArr[1][1])/100);
      if (sResult[0] == '-')
      {
        this.PW1_data.price *= -1;
      }
      */
    }else
    {
      this.PW1_form.get('price').markAsPristine();
    }
  }

  PW1_validateWorker(sName: string)
  {
    var
      i: number;

    for (i = 0; i < this.PW1_WorkerData.getList().length; i++)
    {
      if (this.PW1_WorkerData.getList()[i][0] == sName)
      {
        this.PW1_data.worker_id = this.PW1_WorkerData.getList()[i][1];
        this.avatarImg = this.PW1_WorkerData.getList()[i][2];
        this.avatarOpacity = 1;
        return null;
      }
    }

    //this.avatarImg = '';
    this.avatarOpacity = 0;
    return {'error': 'Il manutentore è necessario.' };
  }
}
