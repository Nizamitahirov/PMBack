import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("team-overview");

  const { data: teamPerformance, isLoading } = trpc.dashboard.getTeamPerformance.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your team's performance and reviews</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("team-overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "team-overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Team Overview
          </button>
          <button
            onClick={() => setActiveTab("objectives")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "objectives"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Objectives
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "reviews"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Team Overview Tab */}
        {activeTab === "team-overview" && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : teamPerformance && teamPerformance.team.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teamPerformance.team.map((employee) => {
                  const perf = teamPerformance.performances.find((p) => p.employee.id === employee.id);
                  return (
                    <Card key={employee.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <CardDescription>{employee.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Performance Status</p>
                            <p className="font-semibold">
                              {perf?.performance?.approvalStatus || "Not Started"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Final Score</p>
                            <p className="text-2xl font-bold">
                              {perf?.performance?.finalScore ? `${perf.performance.finalScore}%` : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <p className="font-semibold">{perf?.performance?.finalRating || "Pending"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No team members found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Objectives Tab */}
        {activeTab === "objectives" && (
          <Card>
            <CardHeader>
              <CardTitle>Team Objectives</CardTitle>
              <CardDescription>Create and manage objectives for your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Objectives management coming soon</p>
            </CardContent>
          </Card>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Submit mid-year and end-year reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Reviews management coming soon</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
