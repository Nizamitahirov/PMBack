import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Loader2, BarChart3, Users, Target, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/employee");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Performance Management System</span>
          </div>
          <div>
            {user ? (
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Manage Employee Performance with Confidence
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            A comprehensive platform for goal setting, mid-year reviews, and end-year evaluations. Track performance,
            assess competencies, and calculate bonuses all in one place.
          </p>
          <div className="mt-8 flex gap-4">
            {!user && (
              <>
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>Get Started</a>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-6">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Goal Setting</h3>
              <p className="text-muted-foreground">
                Managers create objectives, employees approve them, and track progress throughout the year.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Mid-Year Reviews</h3>
              <p className="text-muted-foreground">
                Conduct mid-year check-ins to assess progress and provide feedback.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Competency Assessment</h3>
              <p className="text-muted-foreground">
                Evaluate behavioral competencies with letter grades and detailed feedback.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Calculate final scores, ratings, and bonus amounts based on performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Annual Review Cycle</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold mb-4">1. Goal Setting (Q1)</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Managers define objectives</li>
                <li>• Employees review and approve</li>
                <li>• Set performance targets</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-8 border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold mb-4">2. Mid-Year Review (Q2-Q3)</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Progress assessment</li>
                <li>• Employee self-reflection</li>
                <li>• Manager feedback</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-8 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold mb-4">3. End-Year Review (Q4)</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Final performance score</li>
                <li>• Competency evaluation</li>
                <li>• Bonus calculation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Sign in to access your performance management dashboard
          </p>
          {!user && (
            <Button size="lg" variant="secondary" asChild>
              <a href={getLoginUrl()}>Sign In Now</a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Performance Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
