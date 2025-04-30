import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AppProvider } from "./context/app-context";
import { MainLayout } from "./components/layout/main-layout";
import Dashboard from "./pages/Dashboard";
import GoalSetup from "./pages/GoalSetup";
import Plan from "./pages/Plan";
import Reflection from "./pages/Reflection";
import Motivation from "./pages/Motivation";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/goal-setup" element={<GoalSetup />} />
                  <Route path="/plan" element={<Plan />} />
                  <Route path="/reflection" element={<Reflection />} />
                  <Route path="/motivation" element={<Motivation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
