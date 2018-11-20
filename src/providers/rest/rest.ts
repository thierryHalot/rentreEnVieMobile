import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpErrorResponse} from "@angular/common/http/src/response";
import {Observable} from "rxjs/Observable";



/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

    apiUrl : string = "http://rentre-en-vie-api.fr:80";

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  //fonction qui me permet de récupérer tous les utilisateur en base de donné
    getUsers() {
        return new Promise(resolve => {
            this.http.get(this.apiUrl+'/api/getusers').subscribe(data => {
                resolve(data);
            }, err => {
                console.log(err);
            });
        });
    }

    //fonction qui me permet d'inserer un utilisateur en base de donné

    saveUser(data : Observable<any>) {


        return this.http.post(this.apiUrl+'/api/post/user',
            data,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}});


    }
}
