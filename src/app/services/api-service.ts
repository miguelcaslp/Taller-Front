import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private baseUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  post(endpoint: string, data: any, ): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

   put(endpoint: string, data: any, ): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${this.baseUrl}/${endpoint}`, data, { headers });
  }

    get(endpoint:string): Observable<any> {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

  delete(endpoint: string): Observable<any> {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.delete(`${this.baseUrl}/${endpoint}`, { headers });
}


}