import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Users,
  Database,
  Key,
  Globe,
  Palette,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Server,
  Mail,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const AdminSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    emailNotifications: true,
    autoBackup: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    securityIncidents: true,
    userRegistrations: true,
    dataUpdates: true,
    performanceAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC-5",
    theme: "system",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Admin Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage system configuration, security, and administrative preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put system in maintenance mode</p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable detailed logging</p>
                  </div>
                  <Switch
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, debugMode: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system email notifications</p>
                  </div>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup data</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  System Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => setSystemSettings({...systemSettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max File Upload Size (MB)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label>API Rate Limit (requests/minute)</Label>
                  <Input type="number" defaultValue="1000" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Admin Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button className="w-full">Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Password Policy</Label>
                <Textarea
                  rows={3}
                  placeholder="Define password requirements..."
                  defaultValue="Minimum 8 characters, must include uppercase, lowercase, number, and special character."
                />
              </div>
              <div className="space-y-2">
                <Label>Security Questions</Label>
                <Textarea
                  rows={3}
                  placeholder="Define security questions..."
                  defaultValue="What was your first pet's name? What city were you born in?"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical system notifications</p>
                </div>
                <Switch
                  checked={notifications.systemAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, systemAlerts: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Security Incidents</Label>
                  <p className="text-sm text-muted-foreground">Failed login attempts, suspicious activity</p>
                </div>
                <Switch
                  checked={notifications.securityIncidents}
                  onCheckedChange={(checked) => setNotifications({...notifications, securityIncidents: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>User Registrations</Label>
                  <p className="text-sm text-muted-foreground">New user signups</p>
                </div>
                <Switch
                  checked={notifications.userRegistrations}
                  onCheckedChange={(checked) => setNotifications({...notifications, userRegistrations: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Updates</Label>
                  <p className="text-sm text-muted-foreground">Bulk data imports, exports</p>
                </div>
                <Switch
                  checked={notifications.dataUpdates}
                  onCheckedChange={(checked) => setNotifications({...notifications, dataUpdates: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Performance Alerts</Label>
                  <p className="text-sm text-muted-foreground">System performance issues</p>
                </div>
                <Switch
                  checked={notifications.performanceAlerts}
                  onCheckedChange={(checked) => setNotifications({...notifications, performanceAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SMTP Server</Label>
                <Input defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input type="number" defaultValue="587" />
              </div>
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <Input type="email" defaultValue="admin@studentiq.com" />
              </div>
              <Button variant="outline">Test Email Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto User Approval</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve new registrations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Default User Role</Label>
                  <Select defaultValue="student">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="mentor">Mentor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Account Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Inactive Account Timeout (days)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <div className="space-y-2">
                  <Label>Password Reset Expiry (hours)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Account Deletion</Label>
                    <p className="text-sm text-muted-foreground">Users can delete their accounts</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({...preferences, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={preferences.timeFormat} onValueChange={(value) => setPreferences({...preferences, timeFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin Theme</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Tooltips</Label>
                    <p className="text-sm text-muted-foreground">Display help tooltips</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
