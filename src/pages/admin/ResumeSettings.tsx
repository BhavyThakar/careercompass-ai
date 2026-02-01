import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FileText,
  Settings,
  Upload,
  Download,
  Eye,
  Edit,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResumeSettingsData {
  general: {
    maxFileSize: number;
    allowedFormats: string[];
    autoAnalysis: boolean;
    emailNotifications: boolean;
    analysisTimeout: number;
  };
  scoring: Array<{
    id: number;
    criteria_name: string;
    weight: number;
    required: boolean;
    description: string;
  }>;
  templates: Array<{
    id: number;
    name: string;
    active: boolean;
    downloads: number;
  }>;
}

const ResumeSettings = () => {
  const [settings, setSettings] = useState<ResumeSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) {
          setError("User not authenticated");
          return;
        }

        const user = JSON.parse(rawUser);

        // Fetch settings, scoring criteria, and templates separately
        const [settingsRes, scoringRes, templatesRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/resume-settings", {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role,
            },
          }),
          fetch("http://localhost:5000/api/admin/scoring-criteria", {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role,
            },
          }),
          fetch("http://localhost:5000/api/admin/resume-templates", {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role,
            },
          })
        ]);

        if (!settingsRes.ok || !scoringRes.ok || !templatesRes.ok) {
          throw new Error("Failed to fetch resume settings");
        }

        const settingsData = await settingsRes.json();
        const scoringData = await scoringRes.json();
        const templatesData = await templatesRes.json();

        // Transform the data to match the expected structure
        const transformedSettings = {
          general: {
            maxFileSize: 5,
            allowedFormats: ["PDF", "DOC", "DOCX"],
            autoAnalysis: true,
            emailNotifications: true,
            analysisTimeout: 30,
          },
          scoring: scoringData,
          templates: templatesData,
        };

        // Override defaults with actual settings
        settingsData.forEach((setting: any) => {
          switch (setting.setting_key) {
            case 'max_file_size':
              transformedSettings.general.maxFileSize = setting.setting_value;
              break;
            case 'allowed_formats':
              transformedSettings.general.allowedFormats = setting.setting_value;
              break;
            case 'auto_analysis':
              transformedSettings.general.autoAnalysis = setting.setting_value;
              break;
            case 'email_notifications':
              transformedSettings.general.emailNotifications = setting.setting_value;
              break;
            case 'analysis_timeout':
              transformedSettings.general.analysisTimeout = setting.setting_value;
              break;
          }
        });

        setSettings(transformedSettings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setError("User not authenticated");
        return;
      }

      const user = JSON.parse(rawUser);

      // Prepare settings data for API
      const settingsData = [
        { setting_key: 'max_file_size', setting_value: settings.general.maxFileSize, setting_type: 'number' },
        { setting_key: 'allowed_formats', setting_value: settings.general.allowedFormats, setting_type: 'json' },
        { setting_key: 'auto_analysis', setting_value: settings.general.autoAnalysis, setting_type: 'boolean' },
        { setting_key: 'email_notifications', setting_value: settings.general.emailNotifications, setting_type: 'boolean' },
        { setting_key: 'analysis_timeout', setting_value: settings.general.analysisTimeout, setting_type: 'number' },
      ];

      // Save settings, scoring criteria, and templates
      const [settingsRes, scoringRes, templatesRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/resume-settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
          body: JSON.stringify(settingsData),
        }),
        fetch("http://localhost:5000/api/admin/scoring-criteria", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
          body: JSON.stringify(settings.scoring),
        }),
        fetch("http://localhost:5000/api/admin/resume-templates", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
          body: JSON.stringify(settings.templates),
        })
      ]);

      if (!settingsRes.ok || !scoringRes.ok || !templatesRes.ok) {
        throw new Error("Failed to save settings");
      }

      // Show success message or notification
      console.log("Settings saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Resume Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure resume analysis parameters and templates
          </p>
        </motion.div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Resume Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure resume analysis parameters and templates
          </p>
        </motion.div>
        <div className="text-center text-red-500">
          Error: {error || "Failed to load settings"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Resume Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure resume analysis parameters and templates
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  File Upload Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.general.maxFileSize}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, maxFileSize: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="analysisTimeout">Analysis Timeout (seconds)</Label>
                    <Input
                      id="analysisTimeout"
                      type="number"
                      value={settings.general.analysisTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, analysisTimeout: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allowed File Formats</Label>
                  <div className="flex gap-2">
                    {["PDF", "DOC", "DOCX", "TXT"].map((format) => (
                      <Badge
                        key={format}
                        variant={settings.general.allowedFormats.includes(format) ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newFormats = settings.general.allowedFormats.includes(format)
                            ? settings.general.allowedFormats.filter(f => f !== format)
                            : [...settings.general.allowedFormats, format];
                          setSettings({
                            ...settings,
                            general: { ...settings.general, allowedFormats: newFormats }
                          });
                        }}
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  System Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically analyze resumes upon upload
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.autoAnalysis}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      general: { ...settings.general, autoAnalysis: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for analysis completion
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      general: { ...settings.general, emailNotifications: checked }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Scoring Criteria Weights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.scoring.map((criteria, index) => (
                  <div key={criteria.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="space-y-1">
                        <Label className="capitalize">{criteria.criteria_name}</Label>
                        <p className="text-sm text-muted-foreground">
                          {criteria.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={criteria.weight}
                        onChange={(e) => {
                          const newScoring = [...settings.scoring];
                          newScoring[index] = { ...criteria, weight: parseInt(e.target.value) };
                          setSettings({
                            ...settings,
                            scoring: newScoring
                          });
                        }}
                        className="w-20"
                      />
                      <Switch
                        checked={criteria.required}
                        onCheckedChange={(checked) => {
                          const newScoring = [...settings.scoring];
                          newScoring[index] = { ...criteria, required: checked };
                          setSettings({
                            ...settings,
                            scoring: newScoring
                          });
                        }}
                      />
                      <Label className="text-sm">Required</Label>
                    </div>
                  </div>
                ))}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Scoring Information</AlertTitle>
                  <AlertDescription>
                    Total weight should equal 100%. Required criteria must be present for a resume to pass initial screening.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Resume Templates
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Template
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.downloads} downloads
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={template.active ? "default" : "secondary"}>
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeSettings;
