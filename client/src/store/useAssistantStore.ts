import { create } from "zustand";

type AssistantStore = {
  showAssistant: boolean;
  assistantResponse: string;
  userQuery: string;
  setUserQuery: (query: string) => void;
  setAssistantResponse: (response: string) => void;
  setShowAssistant: (show: boolean) => void;
};

export const useAssistantStore = create<AssistantStore>((set) => ({
  showAssistant: false,
  assistantResponse: "",
  userQuery: "",
  setShowAssistant: (show: boolean) => set({ showAssistant: show }),
  setAssistantResponse: (response: string) =>
    set({ assistantResponse: response }),
  setUserQuery: (query: string) => set({ userQuery: query }),
}));
