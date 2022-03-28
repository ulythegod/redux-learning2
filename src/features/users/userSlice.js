import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const usersApdapter = createEntityAdapter();

const initialState = usersApdapter.getInitialState();

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await client.get('/fakeApi/users');

    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, usersApdapter.setAll);
    }    
});

export default userSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } =
    usersApdapter.getSelectors(state => state.users);
  