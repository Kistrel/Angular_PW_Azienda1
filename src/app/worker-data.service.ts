
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PW1FormData } from './pw1-form-data';
import { of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkerDataService {
  apiUrl: string = 'https://reqres.in/api/users?per_page=100&delay=2';
  postUrl: string = 'https://reqres.in/api/users';
  list: any[];
  iLastPostResponse: number = -1; //-1: not sent, 0: sending, 1: success, 2: failure

  getHttpOptions(): any
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'my-auth-token'
      })
    }

    return httpOptions;
  }

  getList(): any[]
  {
    if ((this.list == null) || (this.list == undefined))
    {
      this.list = [];

      this.http.get<string[]>(this.apiUrl, this.getHttpOptions()).pipe(
          retry(3), //If it fails, it tries again 3 times
          catchError(error => { //catchError in .pipe handles known errors, the second argument in .subscribe handles anything else
            //Log the error
            console.log(error);

            //Supplies a default value in place of the one it didn't get from the server
            return of({
              data: []
            });
          })
        ).subscribe(
        (aResponse: any) =>
        {
          var
            i: number;

          this.list = [];

          //Append the values we got from the server
          for (i = 0; i < aResponse.data.length; i++)
          {
            this.list.push([aResponse.data[i].last_name+', '+aResponse.data[i].first_name, aResponse.data[i].id, aResponse.data[i].avatar]);
          }

          //Log the response, so that it can be checked against the worker_id in the data sent
          console.log('Workers list received:');
          console.log(aResponse);
        }
      )
    }

    return this.list;
  }

  constructor(private http: HttpClient)  {

  }

  sendData(oData: PW1FormData)
  {
    //Sending; also locks the form
    this.iLastPostResponse = 0;

    //For testing purposes, logs the data sent
    console.log('Data sent:');
    console.log(oData);

    //Actual request
    this.http.post(this.postUrl, oData, this.getHttpOptions()).subscribe(
      (aResponse: any) => //Success
      {
        this.iLastPostResponse = 1;

        //For testing purposes, to let the user know the last response
        console.log('Response (success):');
        console.log(aResponse);
      },
      (aResponse: any) => //Failure; catchError in .pipe handles known errors, the second argument in .subscribe handles anything else
      {
        this.iLastPostResponse = 2;

        //For testing purposes, to let the user know the last response
        console.log('Response (error):');
        console.log(aResponse);
      }
    );
  }
}
