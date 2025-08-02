import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Producer, CreateProducerDto, UpdateProducerDto, LoadingState } from '../types';
import { producersService } from '../../services/producersService';

interface ProducersState extends LoadingState {
  producers: Producer[];
  selectedProducer: Producer | null;
}

const initialState: ProducersState = {
  producers: [],
  selectedProducer: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProducers = createAsyncThunk(
  'producers/fetchProducers',
  async (_, { rejectWithValue }) => {
    try {
      return await producersService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch producers');
    }
  }
);

export const fetchProducerById = createAsyncThunk(
  'producers/fetchProducerById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await producersService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch producer');
    }
  }
);

export const createProducer = createAsyncThunk(
  'producers/createProducer',
  async (data: CreateProducerDto, { rejectWithValue }) => {
    try {
      return await producersService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create producer');
    }
  }
);

export const updateProducer = createAsyncThunk(
  'producers/updateProducer',
  async ({ id, data }: { id: string; data: UpdateProducerDto }, { rejectWithValue }) => {
    try {
      return await producersService.update(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update producer');
    }
  }
);

export const deleteProducer = createAsyncThunk(
  'producers/deleteProducer',
  async (id: string, { rejectWithValue }) => {
    try {
      await producersService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete producer');
    }
  }
);

const producersSlice = createSlice({
  name: 'producers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedProducer: (state, action: PayloadAction<Producer | null>) => {
      state.selectedProducer = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch producers
    builder
      .addCase(fetchProducers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch producer by ID
    builder
      .addCase(fetchProducerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProducer = action.payload;
      })
      .addCase(fetchProducerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create producer
    builder
      .addCase(createProducer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProducer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.producers.push(action.payload);
      })
      .addCase(createProducer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update producer
    builder
      .addCase(updateProducer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProducer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.producers.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.producers[index] = action.payload;
        }
        if (state.selectedProducer?.id === action.payload.id) {
          state.selectedProducer = action.payload;
        }
      })
      .addCase(updateProducer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete producer
    builder
      .addCase(deleteProducer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProducer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.producers = state.producers.filter(p => p.id !== action.payload);
        if (state.selectedProducer?.id === action.payload) {
          state.selectedProducer = null;
        }
      })
      .addCase(deleteProducer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedProducer } = producersSlice.actions;
export default producersSlice.reducer; 