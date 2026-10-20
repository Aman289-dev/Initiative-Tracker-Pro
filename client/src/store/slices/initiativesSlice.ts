import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchInitiativesRequest,
  createInitiativeRequest,
  updateInitiativeRequest,
  deleteInitiativeRequest,
} from '../../services/initiativeService';
import type { Initiative, InitiativeFormData, InitiativeFilters } from '../../types';

interface InitiativesState {
  items: Initiative[];
  loading: boolean;
  error: string | null;
  filters: InitiativeFilters;
}

const initialState: InitiativesState = {
  items: [],
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchInitiatives = createAsyncThunk(
  'initiatives/fetchAll',
  async (filters: InitiativeFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await fetchInitiativesRequest(filters);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error || 'Failed to fetch initiatives');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue('Network error while fetching initiatives');
    }
  }
);

export const createInitiative = createAsyncThunk(
  'initiatives/create',
  async (data: InitiativeFormData, { rejectWithValue }) => {
    try {
      const response = await createInitiativeRequest(data);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error || 'Failed to create initiative');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue('Network error while creating initiative');
    }
  }
);

export const updateInitiative = createAsyncThunk(
  'initiatives/update',
  async ({ id, data }: { id: string; data: Partial<InitiativeFormData> }, { rejectWithValue }) => {
    try {
      const response = await updateInitiativeRequest(id, data);
      if (!response.success || !response.data) {
        return rejectWithValue(response.error || 'Failed to update initiative');
      }
      return response.data;
    } catch (err) {
      return rejectWithValue('Network error while updating initiative');
    }
  }
);

export const deleteInitiative = createAsyncThunk(
  'initiatives/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteInitiativeRequest(id);
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to delete initiative');
      }
      return id;
    } catch (err) {
      return rejectWithValue('Network error while deleting initiative');
    }
  }
);

const initiativesSlice = createSlice({
  name: 'initiatives',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<InitiativeFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch initiatives
    builder
      .addCase(fetchInitiatives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitiatives.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInitiatives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create initiative
    builder
      .addCase(createInitiative.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInitiative.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update initiative
    builder
      .addCase(updateInitiative.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInitiative.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete initiative
    builder
      .addCase(deleteInitiative.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInitiative.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteInitiative.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError } = initiativesSlice.actions;
export default initiativesSlice.reducer;
