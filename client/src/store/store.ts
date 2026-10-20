import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import initiativesReducer from './slices/initiativesSlice';

// Add one entry per slice in ./slices — e.g. products: productsReducer.
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    initiatives: initiativesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
