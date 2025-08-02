import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Farm, CreateFarmDto, UpdateFarmDto, AddCropDto, LoadingState } from '../types';
import { farmsService } from '../../services/farmsService';

interface FarmsState extends LoadingState {
  farms: Farm[];
  selectedFarm: Farm | null;
}

const initialState: FarmsState = {
  farms: [],
  selectedFarm: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchFarms = createAsyncThunk(
  'farms/fetchFarms',
  async (_, { rejectWithValue }) => {
    try {
      return await farmsService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farms');
    }
  }
);

export const fetchFarmById = createAsyncThunk(
  'farms/fetchFarmById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await farmsService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farm');
    }
  }
);

export const createFarm = createAsyncThunk(
  'farms/createFarm',
  async (data: CreateFarmDto, { rejectWithValue }) => {
    try {
      return await farmsService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create farm');
    }
  }
);

export const updateFarm = createAsyncThunk(
  'farms/updateFarm',
  async ({ id, data }: { id: string; data: UpdateFarmDto }, { rejectWithValue }) => {
    try {
      return await farmsService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update farm');
    }
  }
);

export const deleteFarm = createAsyncThunk(
  'farms/deleteFarm',
  async (id: string, { rejectWithValue }) => {
    try {
      await farmsService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete farm');
    }
  }
);

export const addCropToFarm = createAsyncThunk(
  'farms/addCropToFarm',
  async ({ farmId, data }: { farmId: string; data: AddCropDto }, { rejectWithValue }) => {
    try {
      return await farmsService.addCrop(farmId, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add crop');
    }
  }
);

export const removeCropFromFarm = createAsyncThunk(
  'farms/removeCropFromFarm',
  async ({ farmId, cropId }: { farmId: string; cropId: string }, { rejectWithValue }) => {
    try {
      await farmsService.removeCrop(farmId, cropId);
      return { farmId, cropId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove crop');
    }
  }
);

const farmsSlice = createSlice({
  name: 'farms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedFarm: (state, action: PayloadAction<Farm | null>) => {
      state.selectedFarm = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch farms
    builder
      .addCase(fetchFarms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.farms = action.payload;
      })
      .addCase(fetchFarms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch farm by ID
    builder
      .addCase(fetchFarmById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarmById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedFarm = action.payload;
      })
      .addCase(fetchFarmById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create farm
    builder
      .addCase(createFarm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFarm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.farms.push(action.payload);
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update farm
    builder
      .addCase(updateFarm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFarm.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.farms.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.farms[index] = action.payload;
        }
        if (state.selectedFarm?.id === action.payload.id) {
          state.selectedFarm = action.payload;
        }
      })
      .addCase(updateFarm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete farm
    builder
      .addCase(deleteFarm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFarm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.farms = state.farms.filter(f => f.id !== action.payload);
        if (state.selectedFarm?.id === action.payload) {
          state.selectedFarm = null;
        }
      })
      .addCase(deleteFarm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add crop to farm
    builder
      .addCase(addCropToFarm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCropToFarm.fulfilled, (state, action) => {
        state.isLoading = false;
        const farm = state.farms.find(f => f.id === action.payload.farmId);
        if (farm && farm.plantedCrops) {
          farm.plantedCrops.push(action.payload);
        }
        if (state.selectedFarm?.id === action.payload.farmId && state.selectedFarm.plantedCrops) {
          state.selectedFarm.plantedCrops.push(action.payload);
        }
      })
      .addCase(addCropToFarm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove crop from farm
    builder
      .addCase(removeCropFromFarm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeCropFromFarm.fulfilled, (state, action) => {
        state.isLoading = false;
        const farm = state.farms.find(f => f.id === action.payload.farmId);
        if (farm && farm.plantedCrops) {
          farm.plantedCrops = farm.plantedCrops.filter(c => c.id !== action.payload.cropId);
        }
        if (state.selectedFarm?.id === action.payload.farmId && state.selectedFarm.plantedCrops) {
          state.selectedFarm.plantedCrops = state.selectedFarm.plantedCrops.filter(
            c => c.id !== action.payload.cropId
          );
        }
      })
      .addCase(removeCropFromFarm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedFarm } = farmsSlice.actions;
export default farmsSlice.reducer; 