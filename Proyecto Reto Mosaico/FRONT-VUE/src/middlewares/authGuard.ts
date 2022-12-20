import { validations } from 'src/common';
import { RouteLocationNormalized } from 'vue-router';
import { LoadingStore } from 'src/stores';

export function signedInBefore(): void {
  if (!sessionStorage.getItem('signedInBefore'))
    sessionStorage.setItem('signedInBefore', String(true));
}

export async function isAuthenticated(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): Promise<{ name: string } | undefined> {
  if (!(from.name == 'signin' && to.name == 'dashboard'))
    LoadingStore.LoadingStore().showLoading();

  if (to.name != 'signin') {
    if (!(await validations.isAuthenticated())) {
      return { name: 'signin' };
    }
    signedInBefore();
  } else {
    if (await validations.isAuthenticated()) {
      signedInBefore();
      return { name: 'dashboard' };
    }
  }
}

export function isAdmin(): { name: string } | undefined {
  if (!validations.isAdmin()) return { name: 'forbidden' };
}

export function isSuperAdmin(): { name: string } | undefined {
  if (!validations.isSuperAdmin()) return { name: 'forbidden' };
}

export function isAdminOrSuperAdmin(): { name: string } | undefined {
  if (!validations.isAdminOrSuperAdmin()) return { name: 'forbidden' };
}

export function isLider(): { name: string } | undefined {
  if (!validations.isLider()) return { name: 'forbidden' };
}
