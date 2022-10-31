import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { City } from '../Interfaces/city';


const PLACES_SERVICE_URL = `${environment.baseApiUrl}/v1/places`;

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
