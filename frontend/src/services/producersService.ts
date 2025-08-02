import apiService from './api';
import { Producer, CreateProducerDto, UpdateProducerDto } from '../store/types';

export const producersService = {
  // Get all producers
  async getAll(): Promise<Producer[]> {
    return apiService.get('/producers');
  },

  // Get producer by ID
  async getById(id: string): Promise<Producer> {
    return apiService.get(`/producers/${id}`);
  },

  // Create new producer
  async create(data: CreateProducerDto): Promise<Producer> {
    return apiService.post('/producers', data);
  },

  // Update producer
  async update(id: string, data: UpdateProducerDto): Promise<Producer> {
    return apiService.patch(`/producers/${id}`, data);
  },

  // Delete producer
  async delete(id: string): Promise<void> {
    return apiService.delete(`/producers/${id}`);
  },
}; 