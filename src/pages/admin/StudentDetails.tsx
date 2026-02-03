import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Brain, 
  Lightbulb, 
  Target, 
  MessageSquare,
  TrendingUp,
  Award,
  BookOpen,
  Activity,
  Loader2,
  AlertCircle,
  Clock,
  Send,
  History,
  Settings,
  Key,
  Trash2,
  Shield,
  UserX,
  RefreshCw,
  Bell,
  Phone,
  MapPin,
  FileText,
  Lock,
  Unlock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StudentDetails {
  id: number;
  name: string;
  email: string;
  enrolled: string;
  phone?: string;
  location?: string;
  status?: string;
  last_login?: string;
  profile_completed?: boolean;
  assessment?: {
    technical_score: number;
    creativity_score: number;
    logic_score: number;
    communication_score: number;
    interest_domain: string;
    submitted_at: string;
  };
  recommendations: Array<{
    career_title: string;
    confidence_score: number;
    explanation: string;
    created_at: string;
  }>;
  activity?: {
    assessment_count: number;
    recommendation_count: number;
    last_assessment: string | null;
    last_recommendation: string | null;
  };
}

// Define types for student history and communications
interface StudentHistory {
  action_type: string;
  created_at: string;
  description: string;
}

interface StudentCommunication {
  id: number;
  type: string;
  subject: string;
  content: string;
  sent_at: string;
  status: string;
}

const StudentDetails = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [history, setHistory] = useState<StudentHistory[]>([]);
  const [communications, setCommunications] = useState<StudentCommunication[]>([]);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("notification");
  const [messageLoading, setMessageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const user = JSON.parse(rawUser);

      try {
        // Fetch student details
        const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}`, {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!response.ok) {
          setError('Failed to fetch student details');
          return;
        }

        const data = await response.json();
        setStudent(data);

        // Fetch student history
        try {
          const historyResponse = await fetch(`http://localhost:5000/api/admin/students/${studentId}/history`, {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role,
            },
          });
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            setHistory(historyData);
          }
        } catch (err) {
          console.log('Failed to fetch history:', err);
        }

        // Fetch student communications
        try {
          const commResponse = await fetch(`http://localhost:5000/api/admin/students/${studentId}/communications`, {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role,
            },
          });
          if (commResponse.ok) {
            const commData = await commResponse.json();
            setCommunications(commData);
          }
        } catch (err) {
          console.log('Failed to fetch communications:', err);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  const handleAction = async () => {
    if (!selectedAction || !student) return;

    setActionLoading(true);
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setError('User not logged in');
      setActionLoading(false);
      return;
    }

    const user = JSON.parse(rawUser);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/students/${student.id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-USER-ID": String(user.id),
          "X-USER-ROLE": user.role,
        },
        body: JSON.stringify({
          action: selectedAction,
          notes: actionNotes,
        }),
      });

      if (!response.ok) {
        setError('Failed to perform action');
        return;
      }

      const result = await response.json();
      
      // Show different messages based on action
      if (selectedAction === 'reset_password' && result.new_password) {
        alert(`Password reset successful! New password: ${result.new_password}`);
      } else {
        alert(result.message);
      }
      
      setActionDialogOpen(false);
      setSelectedAction("");
      setActionNotes("");
      
      // Refresh student data if needed
      if (['activate', 'deactivate', 'suspend_account'].includes(selectedAction)) {
        window.location.reload();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageSubject || !messageContent || !student) return;

    setMessageLoading(true);
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setError('User not logged in');
      setMessageLoading(false);
      return;
    }

    const user = JSON.parse(rawUser);

    try {
      const response = await fetch(`http://localhost:5000/api/admin/students/${student.id}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-USER-ID": String(user.id),
          "X-USER-ROLE": user.role,
        },
        body: JSON.stringify({
          subject: messageSubject,
          content: messageContent,
          type: messageType,
        }),
      });

      if (!response.ok) {
        alert('Failed to send message');
        setMessageLoading(false);
        return;
      }

      const result = await response.json();
      alert(result.message);
      setMessageDialogOpen(false);
      setMessageSubject("");
      setMessageContent("");
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <div className="text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          Error: {error || 'Student not found'}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/students")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              {student.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Student Profile and Activity Details
            </p>
          </div>
        </div>

        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Take Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Take Action on Student</DialogTitle>
              <DialogDescription>
                Select an action to perform on {student.name}'s account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="action">Action</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate Account</SelectItem>
                    <SelectItem value="deactivate">Deactivate Account</SelectItem>
                    <SelectItem value="suspend_account">Suspend Account</SelectItem>
                    <SelectItem value="reset_assessment">Reset Assessment</SelectItem>
                    <SelectItem value="delete_recommendations">Delete Recommendations</SelectItem>
                    <SelectItem value="reset_password">Reset Password</SelectItem>
                    <SelectItem value="send_notification">Send Notification</SelectItem>
                    <SelectItem value="extend_access">Extend Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this action..."
                  value={actionNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setActionNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAction}
                disabled={!selectedAction || actionLoading}
              >
                {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Perform Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student ID</CardTitle>
                <User className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{student.id}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Email</CardTitle>
                <Mail className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium break-all">{student.email}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled</CardTitle>
                <Calendar className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(student.enrolled).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <Shield className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={student.status === 'active' ? "default" : student.status === 'suspended' ? "destructive" : "secondary"}>
                  {student.status || 'Active'}
                </Badge>
              </CardContent>
            </Card>

            {student.assessment && (
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interest Domain</CardTitle>
                  <Target className="ml-auto h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    {student.assessment.interest_domain || 'Not Specified'}
                  </Badge>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <Activity className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={student.profile_completed ? "default" : "secondary"}>
                  {student.profile_completed ? "Complete" : "Incomplete"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                <Clock className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {student.last_login 
                    ? new Date(student.last_login).toLocaleDateString()
                    : "Never"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
                <Award className="ml-auto h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.recommendations.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">{student.phone || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{student.location || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account Type</span>
                  <Badge variant="outline">Student</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(student.enrolled).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Assessments Completed</span>
                  <span className="text-sm font-bold">{student.activity?.assessment_count || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Career Recommendations</span>
                  <span className="text-sm font-bold">{student.activity?.recommendation_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="assessment" className="space-y-6">
          {student.assessment ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Assessment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Technical Skills</span>
                      <span className={`text-sm font-bold ${getScoreColor(student.assessment.technical_score)}`}>
                        {student.assessment.technical_score}%
                      </span>
                    </div>
                    <Progress value={student.assessment.technical_score} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Creativity</span>
                      <span className={`text-sm font-bold ${getScoreColor(student.assessment.creativity_score)}`}>
                        {student.assessment.creativity_score}%
                      </span>
                    </div>
                    <Progress value={student.assessment.creativity_score} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Logic & Reasoning</span>
                      <span className={`text-sm font-bold ${getScoreColor(student.assessment.logic_score)}`}>
                        {student.assessment.logic_score}%
                      </span>
                    </div>
                    <Progress value={student.assessment.logic_score} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Communication</span>
                      <span className={`text-sm font-bold ${getScoreColor(student.assessment.communication_score)}`}>
                        {student.assessment.communication_score}%
                      </span>
                    </div>
                    <Progress value={student.assessment.communication_score} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Assessment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Interest Domain</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {student.assessment.interest_domain || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Assessment Date</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(student.assessment.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Overall Performance</Label>
                    <div className="mt-2">
                      <Badge 
                        variant={student.assessment.technical_score >= 70 ? "default" : "secondary"}
                        className="text-sm"
                      >
                        {student.assessment.technical_score >= 90 ? "Excellent" :
                         student.assessment.technical_score >= 80 ? "Good" :
                         student.assessment.technical_score >= 70 ? "Average" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessment Data</h3>
                <p className="text-muted-foreground text-center">
                  This student hasn't completed any assessments yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {student.recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {student.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        {rec.career_title}
                      </span>
                      <Badge 
                        className={`${getConfidenceColor(rec.confidence_score)} text-white`}
                      >
                        {rec.confidence_score}% Match
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {rec.explanation}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Recommended on {new Date(rec.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground text-center">
                  Career recommendations will appear here once the student completes an assessment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Assessments</span>
                  <span className="text-lg font-bold">{student.activity?.assessment_count || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Recommendations</span>
                  <span className="text-lg font-bold">{student.activity?.recommendation_count || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Assessment</span>
                  <span className="text-sm text-muted-foreground">
                    {student.activity?.last_assessment 
                      ? new Date(student.activity.last_assessment).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Recommendation</span>
                  <span className="text-sm text-muted-foreground">
                    {student.activity?.last_recommendation 
                      ? new Date(student.activity.last_recommendation).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("send_notification");
                    setActionDialogOpen(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Notification
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("reset_assessment");
                    setActionDialogOpen(true);
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Reset Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("deactivate");
                    setActionDialogOpen(true);
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Deactivate Account
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        {item.action_type === 'assessment' && <Brain className="w-4 h-4 text-blue-500" />}
                        {item.action_type === 'recommendation' && <Lightbulb className="w-4 h-4 text-green-500" />}
                        {item.action_type === 'login' && <User className="w-4 h-4 text-purple-500" />}
                        {item.action_type === 'system_action' && <Settings className="w-4 h-4 text-orange-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.action_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Activity History</h3>
                  <p className="text-muted-foreground">
                    No activity has been recorded for this student yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Communication History</h3>
            <Button onClick={() => setMessageDialogOpen(true)} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </div>

          {communications.length > 0 ? (
            <div className="space-y-4">
              {communications.map((comm) => (
                <Card key={comm.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={comm.type === 'email' ? 'default' : 'secondary'}>
                          {comm.type}
                        </Badge>
                        <h4 className="font-medium">{comm.subject}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(comm.sent_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{comm.content}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={comm.status === 'delivered' ? 'default' : comm.status === 'read' ? 'secondary' : 'outline'}>
                        {comm.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Communications</h3>
                <p className="text-muted-foreground text-center">
                  No communications have been sent to this student yet.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Message Dialog */}
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {student?.name}</DialogTitle>
                <DialogDescription>
                  Send a message or notification to this student
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message-type">Message Type</Label>
                  <Select value={messageType} onValueChange={setMessageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter message subject"
                    value={messageSubject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageSubject(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your message here..."
                    value={messageContent}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageContent(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setMessageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={!messageSubject || !messageContent || messageLoading}
                >
                  {messageLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Message
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("activate");
                    setActionDialogOpen(true);
                  }}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Activate Account
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("deactivate");
                    setActionDialogOpen(true);
                  }}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Deactivate Account
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("suspend_account");
                    setActionDialogOpen(true);
                  }}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Suspend Account
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("reset_password");
                    setActionDialogOpen(true);
                  }}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Assessment Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("reset_assessment");
                    setActionDialogOpen(true);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("delete_recommendations");
                    setActionDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Recommendations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedAction("send_notification");
                    setActionDialogOpen(true);
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Send Assessment Reminder
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These actions are irreversible and may affect the student's data and access to the platform.
                </AlertDescription>
              </Alert>
              <div className="mt-4 space-y-3">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete all recommendations? This action cannot be undone.")) {
                      setSelectedAction("delete_recommendations");
                      setActionDialogOpen(true);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetails;
