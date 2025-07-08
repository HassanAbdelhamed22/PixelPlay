import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "./components/ui/provider";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store.ts";
import AuthInitializer from "./components/AuthInitializer.tsx";
import InternetConnectionProvider from "./provider/InternetConnectionProvider.tsx";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <InternetConnectionProvider>
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Provider>
            <AuthInitializer />
            <App />
          </Provider>
        </Router>
      </QueryClientProvider>
    </ReduxProvider>
  </InternetConnectionProvider>
);
