import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Platform, Persona, RoastResult, PlatformData } from '../lib/types';

const initialState = {
    selectedPersona: null as Persona | null,
    platformUsernames: {} as Partial<Record<Platform, string>>,
    platformData: {} as PlatformData,
    loadingPlatforms: [] as Platform[],
    verifiedPlatforms: [] as Platform[],
    isRoasting: false,
    currentRoast: null as RoastResult | null,
    roastHistory: [] as RoastResult[],
    errors: {} as Partial<Record<Platform, string>>,
};

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            ...initialState,

            setSelectedPersona: (persona) => set({ selectedPersona: persona }),

            setPlatformUsername: (platform, username) =>
                set((state) => ({
                    platformUsernames: { ...state.platformUsernames, [platform]: username },
                })),

            setPlatformData: (platform, data) =>
                set((state) => ({
                    platformData: { ...state.platformData, [platform]: data },
                })),

            clearPlatformData: () =>
                set({
                    platformData: {},
                    verifiedPlatforms: [],
                    errors: {},
                }),

            setLoadingPlatform: (platform, loading) =>
                set((state) => ({
                    loadingPlatforms: loading
                        ? [...state.loadingPlatforms, platform]
                        : state.loadingPlatforms.filter((p) => p !== platform),
                })),

            setVerifiedPlatform: (platform, verified) =>
                set((state) => ({
                    verifiedPlatforms: verified
                        ? [...state.verifiedPlatforms, platform]
                        : state.verifiedPlatforms.filter((p) => p !== platform),
                })),

            setIsRoasting: (roasting) => set({ isRoasting: roasting }),

            setCurrentRoast: (roast) => set({ currentRoast: roast }),

            addToRoastHistory: (roast) =>
                set((state) => ({
                    roastHistory: [roast, ...state.roastHistory].slice(0, 10), // Keep last 10
                })),

            setError: (platform, error) =>
                set((state) => ({
                    errors: error
                        ? { ...state.errors, [platform]: error }
                        : Object.fromEntries(
                            Object.entries(state.errors).filter(([key]) => key !== platform)
                        ),
                })),

            resetAll: () => set(initialState),
        }),
        {
            name: 'logkyakahenge-storage',
            partialize: (state) => ({
                roastHistory: state.roastHistory,
            }),
        }
    )
);
