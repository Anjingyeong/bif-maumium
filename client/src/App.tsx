import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdultTest from "./pages/AdultTest";
import ChildTest from "./pages/ChildTest";
import Result from "./pages/Result";
import Info from "./pages/Info";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/test/adult" component={AdultTest} />
      <Route path="/test/child" component={ChildTest} />
      <Route path="/result" component={Result} />
      <Route path="/info" component={Info} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
