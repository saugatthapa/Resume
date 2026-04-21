import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ResumeBuilder from "@/pages/ResumeBuilder";
import CoverLetter from "@/pages/CoverLetter";
import AITools from "@/pages/AITools";
import Settings from "@/pages/Settings";
import AdminTemplatesPage from "@/pages/AdminTemplates";
import SummarySeo from "@/pages/seo/SummarySeo";
import CoverLetterSeo from "@/pages/seo/CoverLetterSeo";
import HeadlineSeo from "@/pages/seo/HeadlineSeo";
import SkillsSeo from "@/pages/seo/SkillsSeo";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/resume-summary-generator" component={SummarySeo} />
      <Route path="/cover-letter-generator-free" component={CoverLetterSeo} />
      <Route path="/resume-headline-generator" component={HeadlineSeo} />
      <Route path="/skills-for-resume-generator" component={SkillsSeo} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/resume" component={ResumeBuilder} />
      <Route path="/dashboard/cover-letter" component={CoverLetter} />
      <Route path="/dashboard/ai-tools" component={AITools} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route path="/admin/templates" component={AdminTemplatesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
