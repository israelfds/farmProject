import apiService from './api';
import { DashboardSummary, FarmsByState, CropData, LandUseData } from '../store/types';

export const dashboardService = {
  // Get dashboard summary
  async getSummary(): Promise<DashboardSummary> {
    return apiService.get('/dashboard/summary');
  },

  // Get farms by state
  async getFarmsByState(): Promise<FarmsByState[]> {
    return apiService.get('/dashboard/farms-by-state');
  },

  // Get crops data
  async getCropsData(): Promise<CropData[]> {
    return apiService.get('/dashboard/crops');
  },

  // Get land use data
  async getLandUseData(): Promise<LandUseData[]> {
    return apiService.get('/dashboard/land-use');
  },
}; 