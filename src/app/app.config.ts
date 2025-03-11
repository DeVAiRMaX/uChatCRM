import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"uchat-19620","appId":"1:439279781514:web:03d40c545774432d1c8f73","storageBucket":"uchat-19620.firebasestorage.app","apiKey":"AIzaSyAiZyO3X8YWNKYGOpb0IhhPVkfBNyqimfI","authDomain":"uchat-19620.firebaseapp.com","messagingSenderId":"439279781514"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
