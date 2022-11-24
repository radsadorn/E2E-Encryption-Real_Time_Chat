import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.SERVER_URL;

	constructor(
        private http: HttpClient
    ) { }

    createNewUser(user: User): Observable<any> {
        return this.http.post<any>(this.apiUrl + '/auth/signin', user);
    }

}