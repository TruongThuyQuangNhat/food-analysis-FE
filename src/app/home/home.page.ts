import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FoodAnalysisService } from './FoodAnalysisService';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  selectedImageFile: File | null = null; 
  imagePreviewUrl: string = '';
  geminiResponse: string = '';
  isLoading: boolean = false;

  constructor(private foodAnalysisService: FoodAnalysisService) {}

  ngOnInit() {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        this.selectedImageFile = new File([blob], `photo.${image.format}`, { type: blob.type });
        this.imagePreviewUrl = image.webPath;
        this.geminiResponse = ''; 
      } else {
        this.selectedImageFile = null;
        this.imagePreviewUrl = '';
        this.geminiResponse = '';
      }
    } catch (error) {
      console.error('Lỗi khi chụp ảnh:', error);
      this.geminiResponse = 'Lỗi khi chụp ảnh.';
    }
  }

  async analyzeFood() {
    if (!this.selectedImageFile) {
      this.geminiResponse = 'Vui lòng chụp hoặc chọn một hình ảnh.';
      return;
    }

    this.isLoading = true;
    this.geminiResponse = 'Đang phân tích hình ảnh, vui lòng chờ...';

    try {
      const response = await this.foodAnalysisService.analyzeImage(this.selectedImageFile);
      this.geminiResponse = response;
    } catch (error: any) {
      this.geminiResponse = `Đã xảy ra lỗi: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }
}
