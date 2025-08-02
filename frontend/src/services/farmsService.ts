import apiService from './api';
import { Farm, CreateFarmDto, UpdateFarmDto, AddCropDto, PlantedCrop } from '../store/types';

export const farmsService = {
  // Get all farms
  async getAll(): Promise<Farm[]> {
    return apiService.get('/farms');
  },

  // Get farm by ID
  async getById(id: string): Promise<Farm> {
    return apiService.get(`/farms/${id}`);
  },

  // Create new farm
  async create(data: CreateFarmDto): Promise<Farm> {
    return apiService.post('/farms', data);
  },

  // Update farm
  async update(id: string, data: UpdateFarmDto): Promise<Farm> {
    return apiService.patch(`/farms/${id}`, data);
  },

  // Delete farm
  async delete(id: string): Promise<void> {
    return apiService.delete(`/farms/${id}`);
  },

  // Add crop to farm
  async addCrop(farmId: string, data: AddCropDto): Promise<PlantedCrop> {
    return apiService.post(`/farms/${farmId}/crops`, data);
  },

  // Remove crop from farm
  async removeCrop(farmId: string, cropId: string): Promise<void> {
    return apiService.delete(`/farms/${farmId}/crops/${cropId}`);
  },
}; 