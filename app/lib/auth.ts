import { AuthApi } from '~/api/api';

export async function isAuth(): Promise<boolean> {
  try {
    const response = await AuthApi.getUser();
    return response.status === 201;
  } catch (error) {

    console.error('Auth check failed:', error);
    return false;
  }
}


export async function getCurrentUser() {
  try {
    const response = await AuthApi.getUser();
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

