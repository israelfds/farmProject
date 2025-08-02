// Producer types
export interface Producer {
  id: string;
  name: string;
  document: string;
  createdAt: string;
  updatedAt: string;
  farms?: Farm[];
}

export interface CreateProducerDto {
  name: string;
  document: string;
}

export interface UpdateProducerDto {
  name?: string;
  document?: string;
}

// Farm types
export interface Farm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalAreaHectares: number;
  arableAreaHectares: number;
  vegetationAreaHectares: number;
  producerId: string;
  createdAt: string;
  updatedAt: string;
  producer?: Producer;
  plantedCrops?: PlantedCrop[];
}

export interface CreateFarmDto {
  name: string;
  city: string;
  state: string;
  totalAreaHectares: number;
  arableAreaHectares: number;
  vegetationAreaHectares: number;
  producerId: string;
}

export interface UpdateFarmDto {
  name?: string;
  city?: string;
  state?: string;
  totalAreaHectares?: number;
  arableAreaHectares?: number;
  vegetationAreaHectares?: number;
}

// Planted Crop types
export interface PlantedCrop {
  id: string;
  cropName: string;
  harvestSeason: string;
  farmId: string;
  farm?: Farm;
}

export interface AddCropDto {
  cropName: string;
  harvestSeason: string;
}

// Dashboard types
export interface DashboardSummary {
  totalProducers: number;
  totalFarms: number;
  totalArea: number;
  totalCrops: number;
}

export interface FarmsByState {
  state: string;
  count: number;
  totalArea: number;
}

export interface CropData {
  cropName: string;
  count: number;
  totalArea: number;
}

export interface LandUseData {
  category: string;
  totalArea: number;
  percentage: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

// UI types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit' | 'delete' | null;
  data?: any;
} 