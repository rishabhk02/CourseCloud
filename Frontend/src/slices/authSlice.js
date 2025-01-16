import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    }
  },
});

export const { setSignupData, setLoading } = authSlice.actions;

export default authSlice.reducer;
