import { motion } from "framer-motion";
import { useState } from "react";
import {
  Brain,
  Settings,
  Zap,
  Cpu,
  Database,
  Key,
  Gauge,
  Activity,
  CheckCircle,
  AlertTriangle,
  Save,
  RefreshCw,
  Play,
  Pause,
  Bot,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Server,
  Network,
  Layers,
  Code,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock AI configuration data
const aiModels = [
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    status: "active",
    version: "4.0",
    performance: 95,
    cost: "$0.03/1K tokens",
    description: "Most advanced model for complex reasoning and analysis"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    status: "active",
    version: "3.5",
    performance: 85,
    cost: "$0.002/1K tokens",
    description: "Fast and cost-effective for general tasks"
  },
  {
    id: "claude-3",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    status: "inactive",
    version: "3.0",
    performance: 92,
    cost: "$0.015/1K tokens",
    description: "Excellent for creative and analytical tasks"
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    status: "inactive",
    version: "1.5",
    performance: 88,
    cost: "$0.001/1K tokens",
    description: "Multimodal capabilities with strong reasoning"
  }
];

const systemMetrics = {
  totalRequests: 15420,
  successRate: 98.7,
  avgResponseTime: 1.2,
  activeModels: 2,
  totalTokens: 2847391,
  uptime: 99.9
};

const AIConfiguration = () => {
  const [activeModel, setActiveModel] = useState("gpt-4");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [autoScaling, setAutoScaling] = useState(true);
  const [rateLimiting, setRateLimiting] = useState(true);

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              AI Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage AI models, APIs, and system performance settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      {/* System Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{systemMetrics.totalRequests.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{systemMetrics.successRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{systemMetrics.avgResponseTime}s</p>
                <p className="text-xs text-muted-foreground mt-1">Target: 2s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold">{systemMetrics.uptime}%</p>
                <p className="text-xs text-muted-foreground mt-1">99.9% target</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* AI Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Available AI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{model.name}</h3>
                          <Badge variant={model.status === "active" ? "default" : "secondary"}>
                            {model.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{model.provider} • v{model.version}</p>
                        <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Performance</div>
                        <div className="flex items-center gap-2">
                          <Progress value={model.performance} className="w-20" />
                          <span className="text-xs">{model.performance}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{model.cost}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={activeModel === model.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveModel(model.id)}
                          disabled={model.status === "inactive"}
                        >
                          {activeModel === model.id ? "Active" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings Tab */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  API Keys & Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="openai-key"
                      type={apiKeyVisible ? "text" : "password"}
                      placeholder="sk-..."
                      value="sk-...abcd1234"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    >
                      {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="anthropic-key"
                      type="password"
                      placeholder="sk-ant-..."
                      value="sk-ant-...efgh5678"
                    />
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google-key">Google AI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="google-key"
                      type="password"
                      placeholder="AIza..."
                      value="AIza...ijkl9012"
                    />
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Scaling</Label>
                    <p className="text-sm text-muted-foreground">Automatically scale API calls based on demand</p>
                  </div>
                  <Switch checked={autoScaling} onCheckedChange={setAutoScaling} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Prevent API abuse with request limits</p>
                  </div>
                  <Switch checked={rateLimiting} onCheckedChange={setRateLimiting} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Max Requests per Minute</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Timeout (seconds)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-primary" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>1.2s avg</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Throughput</span>
                    <span>850 req/min</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {aiModels.filter(m => m.status === "active").map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-muted-foreground">{model.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{model.performance}%</div>
                        <div className="text-xs text-muted-foreground">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Usage Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-primary">{systemMetrics.totalTokens.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Tokens Used</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-success">{systemMetrics.activeModels}</div>
                  <div className="text-sm text-muted-foreground">Active Models</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-warning">2.1M</div>
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                </div>
                <div className="text-center p-4 border rounded">
                  <div className="text-2xl font-bold text-accent">99.2%</div>
                  <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Input Validation</Label>
                    <p className="text-sm text-muted-foreground">Sanitize and validate all AI inputs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Content Filtering</Label>
                    <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Prevent abuse with request limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive data in transit</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High API usage detected from IP 192.168.1.100. Consider implementing additional rate limiting.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All security patches applied. System is up to date.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Unusual pattern detected in model responses. Manual review recommended.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom Prompts</Label>
                  <Textarea
                    placeholder="Enter custom system prompts for AI models..."
                    rows={4}
                    defaultValue="You are an expert career counselor helping students find their ideal career path. Provide detailed, actionable advice based on their skills, interests, and market trends."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Model Parameters</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Temperature</Label>
                      <Input type="number" step="0.1" min="0" max="2" defaultValue="0.7" />
                    </div>
                    <div>
                      <Label className="text-sm">Max Tokens</Label>
                      <Input type="number" defaultValue="2048" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfiguration;
