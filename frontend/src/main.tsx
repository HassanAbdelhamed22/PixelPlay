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
  <QueryClientProvider client={queryClient}>
    <ReduxProvider store={store}>
      <InternetConnectionProvider>
        <Router>
          <Provider>
            <AuthInitializer />
            <App />
          </Provider>
        </Router>
      </InternetConnectionProvider>
    </ReduxProvider>
  </QueryClientProvider>
);
