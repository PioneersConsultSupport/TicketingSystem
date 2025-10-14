import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subcategory } from '../models/subcategory';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = 'Category';
  subcategoryBaseUrl = 'Subcategory';

  constructor(private http: HttpClient) {}

  // ---------- Category ----------
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl + '/AllCategory');
  }

  addCategory(category: Category): Observable<void> {
    return this.http.post<void>(this.baseUrl, category);
  }

  updateCategory(category: Category): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/Update', category);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getCategoriesByType(type: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/ByType/${type}`);
  }

  // ---------- Subcategory ----------
  addSubcategory(subcategory: Subcategory): Observable<void> {
    return this.http.post<void>(this.subcategoryBaseUrl, subcategory);
  }

  updateSubcategory(subcategory: Subcategory): Observable<void> {
    return this.http.post<void>(
      `${this.subcategoryBaseUrl}/Update`,
      subcategory,
    );
  }

  deleteSubcategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.subcategoryBaseUrl}/${id}`);
  }

  getSubcategoryById(id: number): Observable<Subcategory> {
    return this.http.get<Subcategory>(`${this.subcategoryBaseUrl}/${id}`);
  }

  getSubcategoriesByCategoryId(categoryId: number): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(
      `${this.subcategoryBaseUrl}/ByCategory/${categoryId}`,
    );
  }
}
