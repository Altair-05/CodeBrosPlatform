import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { HeaderWithNotifications } from "@/components/header-with-notifications"; // IMPORT THE NEW WRAPPER
import Home from "@/pages/home";
import Network from "@/pages/network";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/network" component={Network} />
      <Route path="/profile/:id" component={Profile} />
      <Route path="/messages" component={Messages} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="codebros-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <HeaderWithNotifications />
              <main>
                <Router />
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
