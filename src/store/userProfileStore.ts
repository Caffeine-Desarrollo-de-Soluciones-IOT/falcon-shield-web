import { defineStore } from 'pinia';
import { UserProfileService } from '@/service/UserProfileService';
import { ResponseError } from '@/config/errors';

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    isProfileCreated: null as boolean | null
  }),
  actions: {
    async checkUserProfile() {
      try {
        await UserProfileService.getUserProfile();
        this.setProfileCreated();

      } catch (error) {
        //if the error is a 404, the user profile is not created
        if (error instanceof ResponseError && error.code === 404) {
          this.isProfileCreated = false;
        } else {
          this.isProfileCreated = null;
        }
      }
    },
    setProfileCreated() {
      this.isProfileCreated = true;
    }
  }
});
