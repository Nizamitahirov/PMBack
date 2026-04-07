import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [midYearComment, setMidYearComment] = useState("");
  const [endYearComment, setEndYearComment] = useState("");

  const { data: myPerformance, isLoading } = trpc.dashboard.getMyPerformance.useQuery();
  const submitMidYearMutation = trpc.midYearReview.submitEmployeeComment.useMutation();
  const submitEndYearMutation = trpc.endYearReview.submitEmployeeComment.useMutation();

  const handleSubmitMidYear = async () => {
    if (!myPerformance?.performance) {
      toast.error("Performance record not found");
      return;
    }

    try {
      await submitMidYearMutation.mutateAsync({
        employeePerformanceId: myPerformance.performance.id,
        comment: midYearComment,
      });
      toast.success("Mid-year comment submitted");
      setMidYearComment("");
    } catch (error) {
      toast.error("Failed to submit mid-year comment");
    }
  };

  const handleSubmitEndYear = async () => {
    if (!myPerformance?.performance) {
      toast.error("Performance record not found");
      return;
    }

    try {
      await submitEndYearMutation.mutateAsync({
        employeePerformanceId: myPerformance.performance.id,
        comment: endYearComment,
      });
      toast.success("End-year comment submitted");
      setEndYearComment("");
    } catch (error) {
      toast.error("Failed to submit end-year comment");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Performance</h1>
          <p className="text-muted-foreground mt-2">Track your performance and submit reviews</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
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
            onClick={() => setActiveTab("mid-year")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "mid-year"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mid-Year Review
          </button>
          <button
            onClick={() => setActiveTab("end-year")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "end-year"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            End-Year Review
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Performance Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {myPerformance?.performance?.approvalStatus || "Not Started"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Objective Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {myPerformance?.performance?.objectiveScore
                        ? `${myPerformance.performance.objectiveScore}%`
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Competency Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {myPerformance?.performance?.competencyScore
                        ? `${myPerformance.performance.competencyScore}%`
                        : "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Final Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{myPerformance?.performance?.finalRating || "Pending"}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Objectives Tab */}
            {activeTab === "objectives" && (
              <div className="space-y-4">
                {myPerformance?.objectives && myPerformance.objectives.length > 0 ? (
                  myPerformance.objectives.map((objective) => (
                    <Card key={objective.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{objective.title}</CardTitle>
                        <CardDescription>{objective.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-semibold">{objective.status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Target Score</p>
                            <p className="font-semibold">{objective.targetScore}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Due Date</p>
                            <p className="font-semibold">
                              {objective.dueDate ? new Date(objective.dueDate).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          {objective.status === "SUBMITTED" && (
                            <div>
                              <Button variant="default" size="sm">
                                Approve Objective
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8">
                      <p className="text-center text-muted-foreground">No objectives found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Mid-Year Review Tab */}
            {activeTab === "mid-year" && (
              <Card>
                <CardHeader>
                  <CardTitle>Mid-Year Self-Assessment</CardTitle>
                  <CardDescription>Share your progress and challenges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your Comments</label>
                    <Textarea
                      placeholder="Share your mid-year self-assessment..."
                      value={midYearComment}
                      onChange={(e) => setMidYearComment(e.target.value)}
                      className="mt-2 min-h-32"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitMidYear}
                    disabled={submitMidYearMutation.isPending || !midYearComment}
                  >
                    {submitMidYearMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Mid-Year Review"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* End-Year Review Tab */}
            {activeTab === "end-year" && (
              <Card>
                <CardHeader>
                  <CardTitle>End-Year Self-Assessment</CardTitle>
                  <CardDescription>Reflect on your annual performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your Comments</label>
                    <Textarea
                      placeholder="Share your end-year self-assessment..."
                      value={endYearComment}
                      onChange={(e) => setEndYearComment(e.target.value)}
                      className="mt-2 min-h-32"
                    />
                  </div>
                  <Button
                    onClick={handleSubmitEndYear}
                    disabled={submitEndYearMutation.isPending || !endYearComment}
                  >
                    {submitEndYearMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit End-Year Review"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
