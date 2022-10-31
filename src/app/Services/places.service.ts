import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../Interfaces/city';

const PLACES_SERVICE_URL = 'http://localhost:3001/v1/places'

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  getPlaces(): Observable<City[]> {
    return this.http.get<City[]>(PLACES_SERVICE_URL);
  }

  getPlace(name: string):Observable<City> {
    return this.http.get<City>(`${PLACES_SERVICE_URL}/${name}`);
  }
}
