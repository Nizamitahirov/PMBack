import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("performance-years");
  const [newYear, setNewYear] = useState("");

  const { data: performanceYears, isLoading: yearsLoading, refetch: refetchYears } = trpc.performanceYear.getAll.useQuery();
  const createYearMutation = trpc.performanceYear.create.useMutation();
  const setActiveMutation = trpc.performanceYear.setActive.useMutation();

  const handleCreateYear = async () => {
    if (!newYear) {
      toast.error("Please enter a year");
      return;
    }

    try {
      const year = parseInt(newYear);
      const today = new Date();
      const startDate = new Date(year, 0, 1);
      const midYearStart = new Date(year, 5, 1);
      const endYearStart = new Date(year, 10, 1);

      await createYearMutation.mutateAsync({
        year,
        goalSettingStart: startDate.toISOString().split("T")[0],
        goalSettingEnd: new Date(year, 2, 31).toISOString().split("T")[0],
        midYearReviewStart: midYearStart.toISOString().split("T")[0],
        midYearReviewEnd: new Date(year, 7, 31).toISOString().split("T")[0],
        endYearReviewStart: endYearStart.toISOString().split("T")[0],
        endYearReviewEnd: new Date(year, 11, 31).toISOString().split("T")[0],
      });

      toast.success("Performance year created successfully");
      setNewYear("");
      refetchYears();
    } catch (error) {
      toast.error("Failed to create performance year");
    }
  };

  const handleSetActive = async (yearId: number) => {
    try {
      await setActiveMutation.mutateAsync({ id: yearId });
      toast.success("Performance year activated");
      refetchYears();
    } catch (error) {
      toast.error("Failed to activate performance year");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage performance management system configuration</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("performance-years")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "performance-years"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance Years
          </button>
          <button
            onClick={() => setActiveTab("evaluation-scales")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "evaluation-scales"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Evaluation Scales
          </button>
          <button
            onClick={() => setActiveTab("weight-config")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "weight-config"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Weight Configuration
          </button>
        </div>

        {/* Performance Years Tab */}
        {activeTab === "performance-years" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Performance Year</CardTitle>
                <CardDescription>Add a new performance year to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2026"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleCreateYear} disabled={createYearMutation.isPending}>
                      {createYearMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Year
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Years</CardTitle>
                <CardDescription>Manage performance review cycles</CardDescription>
              </CardHeader>
              <CardContent>
                {yearsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : performanceYears && performanceYears.length > 0 ? (
                  <div className="space-y-4">
                    {performanceYears.map((year) => (
                      <div key={year.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-semibold">{year.year}</h3>
                          <p className="text-sm text-muted-foreground">
                            {year.isActive ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                                Inactive
                              </span>
                            )}
                          </p>
                        </div>
                        {!year.isActive && (
                          <Button
                            onClick={() => handleSetActive(year.id)}
                            disabled={setActiveMutation.isPending}
                            variant="outline"
                            size="sm"
                          >
                            {setActiveMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Set Active"
                            )}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No performance years found</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Evaluation Scales Tab */}
        {activeTab === "evaluation-scales" && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Scales</CardTitle>
              <CardDescription>Configure evaluation rating scales (E++, E+, E, E-, E--)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Evaluation scales configuration coming soon</p>
            </CardContent>
          </Card>
        )}

        {/* Weight Configuration Tab */}
        {activeTab === "weight-config" && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Weight Configuration</CardTitle>
              <CardDescription>Set objectives vs competencies weight by position group</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Weight configuration coming soon</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
