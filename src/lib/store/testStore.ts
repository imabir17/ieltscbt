import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TestState {
  attemptId: string | null;
  timeLeft: number;
  currentSection: 'listening' | 'reading' | 'writing' | 'speaking';
  answers: Record<string, string>;
  setAttemptId: (id: string) => void;
  setTimeLeft: (time: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setSection: (section: 'listening' | 'reading' | 'writing' | 'speaking') => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      attemptId: null,
      timeLeft: 60 * 60, // 1 hour default
      currentSection: 'listening',
      answers: {},
      setAttemptId: (id) => set({ attemptId: id }),
      setTimeLeft: (time) => set({ timeLeft: time }),
      setAnswer: (questionId, answer) => 
        set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
      setSection: (section) => set({ currentSection: section }),
    }),
    {
      name: 'cbt-test-storage', // saves to local storage automatically
    }
  )
);
