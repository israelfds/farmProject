import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardSummary, FarmsByState, CropData, LandUseData, LoadingState } from '../types';
import { dashboardService } from '../../services/dashboardService';

interface DashboardState extends LoadingState {
  summary: DashboardSummary | null;
  farmsByState: FarmsByState[];
  cropsData: CropData[];
  landUseData: LandUseData[];
}

const initialState: DashboardState = {
  summary: null,
  farmsByState: [],
  cropsData: [],
  landUseData: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getSummary();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard summary');
    }
  }
);

export const fetchFarmsByState = createAsyncThunk(
  'dashboard/fetchFarmsByState',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getFarmsByState();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch farms by state');
    }
  }
);

export const fetchCropsData = createAsyncThunk(
  'dashboard/fetchCropsData',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getCropsData();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch crops data');
    }
  }
);

export const fetchLandUseData = createAsyncThunk(
  'dashboard/fetchLandUseData',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getLandUseData();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch land use data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard summary
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch farms by state
    builder
      .addCase(fetchFarmsByState.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarmsByState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.farmsByState = action.payload;
      })
      .addCase(fetchFarmsByState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch crops data
    builder
      .addCase(fetchCropsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCropsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cropsData = action.payload;
      })
      .addCase(fetchCropsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch land use data
    builder
      .addCase(fetchLandUseData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLandUseData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.landUseData = action.payload;
      })
      .addCase(fetchLandUseData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 