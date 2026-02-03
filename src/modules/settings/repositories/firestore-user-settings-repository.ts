"use client";

import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";

import type { UserSettings } from "@/modules/settings/domain/types";
import type { BaseUserSettingsRepository } from "@/modules/settings/interfaces/base-user-settings-repository";

const COLLECTION_ID = "user-settings";

export type GetFirestoreInstance = () => Firestore | null;

export class FirestoreUserSettingsRepository implements BaseUserSettingsRepository {
  constructor(private readonly getFirestoreInstance: GetFirestoreInstance) {}

  async get(userId: string): Promise<UserSettings | null> {
    const db = this.getFirestoreInstance();
    if (!db) return null;
    const ref = doc(db, COLLECTION_ID, userId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    const data = snapshot.data();
    return {
      locale: data.locale,
      theme: data.theme,
    };
  }

  async set(userId: string, settings: UserSettings): Promise<void> {
    const db = this.getFirestoreInstance();
    if (!db) return;
    const ref = doc(db, COLLECTION_ID, userId);
    await setDoc(ref, {
      locale: settings.locale ?? null,
      theme: settings.theme ?? null,
    });
  }
}
