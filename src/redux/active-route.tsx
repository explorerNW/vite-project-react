import { createSlice } from '@reduxjs/toolkit';

export const activeRouteSlice = createSlice({
  name: 'activeRoute',
  initialState: {
    value: '',
  },
  reducers: {
    setActivePath: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setActivePath } = activeRouteSlice.actions;
export default activeRouteSlice.reducer;
