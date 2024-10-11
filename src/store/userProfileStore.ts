import { defineStore } from 'pinia';
import { UserProfileService } from '@/service/UserProfileService';

export const useUserProfileStore = defineStore('userProfile', {
  state: () => ({
    isProfileCreated: null as boolean | null
  }),
  actions: {
    async checkUserProfile() {
      if (this.isProfileCreated === null) {
        this.isProfileCreated = await UserProfileService.isUserProfileCreated();
      }
      return this.isProfileCreated;
    },
    setProfileCreated() {
      this.isProfileCreated = true;
    }
  }
});