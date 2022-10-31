import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from '../Interfaces/city';

@Injectable({
  providedIn: 'root'
})
export class TemperaturaService {

    constructor(private http: HttpClient) { }

    getWeather(date:string, ciudad:City)  {
        let fecha = date;
        return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${0}&longitude=${0}&hourly=temperature_2m&start_date=${fecha}&end_date=${fecha}`);
        //return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.long}&hourly=temperature_2m&start_date=${fecha}&end_date=${fecha}`);
    }
}
