import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodAnalysisService {
  //private readonly BACKEND_URL = 'http://localhost:3000';
  private readonly BACKEND_URL = 'https://food-analysis-backend-wcyd.onrender.com';

  constructor(private http: HttpClient) { }

  async analyzeImage(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', imageFile); 

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.BACKEND_URL}/analyze-food`, formData)
      );

      if (response.success) {
        return response.response;
      } else {
        throw new Error(response.error || 'Phân tích hình ảnh không thành công từ backend.');
      }
    } catch (error: any) {
      console.error('Lỗi khi gọi backend:', error);
      throw new Error(`Đã xảy ra lỗi khi phân tích hình ảnh: ${error.message}`);
    }
  }
}