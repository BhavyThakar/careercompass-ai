import { motion } from "framer-motion";
import { useState } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FileUpload {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

const DataUpload = () => {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file =>
      file.type === 'text/csv' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );

    const newUploads: FileUpload[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newUploads]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file =>
      file.type === 'text/csv' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel'
    );

    const newUploads: FileUpload[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newUploads]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFile = (id: string) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'uploading' } : f
    ));

    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          const newProgress = f.progress + Math.random() * 20;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, status: 'success' };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 200);
  };

  const uploadAll = () => {
    files.filter(f => f.status === 'pending').forEach(f => uploadFile(f.id));
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Data Upload
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload student data files (CSV or Excel) to update the system
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
                <p className="text-muted-foreground mb-4">
                  Supports CSV and Excel files (.csv, .xlsx, .xls)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Files to Upload ({files.length})</h4>
                    <Button onClick={uploadAll} disabled={!files.some(f => f.status === 'pending')}>
                      Upload All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {files.map((upload) => (
                      <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{upload.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {upload.status === 'uploading' && (
                            <Progress value={upload.progress} className="mt-2" />
                          )}
                        </div>
                        <Badge variant={
                          upload.status === 'success' ? 'default' :
                          upload.status === 'error' ? 'destructive' :
                          'secondary'
                        }>
                          {upload.status === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {upload.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                          {upload.status}
                        </Badge>
                        {upload.status === 'pending' && (
                          <Button size="sm" onClick={() => uploadFile(upload.id)}>
                            Upload
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(upload.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Supported Formats</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• CSV files (.csv)</li>
                  <li>• Excel files (.xlsx, .xls)</li>
                  <li>• Maximum file size: 10MB per file</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Required Columns</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Name (required)</li>
                  <li>• Email (required)</li>
                  <li>• Major/Specialization</li>
                  <li>• Graduation Year</li>
                  <li>• Skills (comma-separated)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Validation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Email addresses must be valid</li>
                  <li>• Duplicate emails will be skipped</li>
                  <li>• Invalid rows will be reported</li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Uploaded data will be processed and added to the student database.
                  You can review and manage uploaded data from the "All Students" page.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DataUpload;
