import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload
    }
  },
});

export const { setSignupData, setIsLoading } = authSlice.actions;

export default authSlice.reducer;
