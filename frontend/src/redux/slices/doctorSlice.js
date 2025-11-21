import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorService } from '../../services/appointmentService';

const initialState = {
  doctors: [],
  currentDoctor: null,
  pagination: null,
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  'doctors/fetch',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctors(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctors/fetchById',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctorById(doctorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDoctor: (state, action) => {
      state.currentDoctor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch doctor by ID
      .addCase(fetchDoctorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
