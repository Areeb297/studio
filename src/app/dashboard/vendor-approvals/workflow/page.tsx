'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  MessageSquare,
  Calendar,
  Building2,
  Mail,
  Phone
} from "lucide-react";

export default function VendorWorkflowPage() {
  const [selectedVendor, setSelectedVendor] = useState("VEN-2024-001");

  // Workflow stages for vendor approval
  const workflowStages = [
    {
      id: 1,
      name: "Vendor Form",
      status: "completed",
      assignee: "System",
      completedDate: "2024-09-01",
      description: "Initial vendor registration form submitted",
      duration: "0 days"
    },
    {
      id: 2,
      name: "Conditional",
      status: "completed", 
      assignee: "Auto Validation",
      completedDate: "2024-09-01",
      description: "What is the cost of new applications?",
      note: "Estimated value: PKR 2,500,000",
      duration: "0 days"
    },
    {
      id: 3,
      name: "Manager Approval",
      status: "completed",
      assignee: "Adil Hasnain",
      completedDate: "2024-09-03", 
      description: "Department manager review and approval",
      avatar: "AH",
      duration: "2 days"
    },
    {
      id: 4,
      name: "IT TEAM",
      status: "in-progress",
      assignee: "Current Stage",
      description: "Technical assessment and system integration review",
      avatar: "IT",
      duration: "3 days (ongoing)"
    },
    {
      id: 5,
      name: "End",
      status: "pending",
      assignee: "Final Approval",
      description: "Executive approval and vendor registration completion",
      duration: "Pending"
    }
  ];

  // Recent workflow activity
  const workflowActivity = [
    {
      timestamp: "Today at 11:43am",
      user: "Adil Hasnain",
      action: "Advanced workflow to IT TEAM stage",
      status: "progress",
      avatar: "AH"
    },
    {
      timestamp: "Today at 11:43am", 
      user: "Adil Hasnain",
      action: "Left a comment on vendor application",
      status: "comment",
      avatar: "AH"
    },
    {
      timestamp: "Jan 7, 2022 at 11:43am",
      user: "System",
      action: "Vendor application submitted and validated",
      status: "completed",
      avatar: "SY"
    }
  ];

  // Vendor details
  const vendorDetails = {
    id: "VEN-2024-001",
    companyName: "Al-Noor Trading Corporation",
    contactPerson: "Muhammad Hassan",
    email: "hassan@alnoor-trading.com",
    phone: "+92-21-34567890",
    category: "Food & Catering",
    estimatedValue: 2500000,
    submissionDate: "2024-09-01",
    currentStage: "IT TEAM Review"
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'in-progress': 
        return <Play className="h-6 w-6 text-blue-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-gray-400" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 border-2';
      case 'pending':
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vendor Approval Workflow</h1>
          <p className="text-muted-foreground">Track and manage vendor approval process step-by-step</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment  
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            View Documents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vendor Information Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Application ID</p>
              <p className="font-semibold">{vendorDetails.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company Name</p>
              <p className="font-semibold">{vendorDetails.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Person</p>
              <p className="font-medium">{vendorDetails.contactPerson}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline">{vendorDetails.category}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Value</p>
              <p className="font-semibold text-green-600">₨ {vendorDetails.estimatedValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">{vendorDetails.submissionDate}</p>
            </div>
            <div className="pt-4 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Email Vendor
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Vendor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Workflow Visualization */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary" />
              Approval Workflow Progress
            </CardTitle>
            <CardDescription>
              Current stage: {vendorDetails.currentStage} • Started {vendorDetails.submissionDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Workflow Stages */}
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                {workflowStages.map((stage, index) => (
                  <div key={stage.id} className="flex flex-col items-center flex-1 relative">
                    {/* Stage Card */}
                    <Card className={`w-full max-w-48 ${getStageColor(stage.status)} mb-4`}>
                      <CardContent className="p-4 text-center">
                        <div className="mb-3">
                          {getStageIcon(stage.status)}
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{stage.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{stage.assignee}</p>
                        {stage.avatar && (
                          <Avatar className="h-8 w-8 mx-auto mb-2">
                            <AvatarFallback className="text-xs">{stage.avatar}</AvatarFallback>
                          </Avatar>
                        )}
                        <Badge 
                          variant={
                            stage.status === 'completed' ? 'default' :
                            stage.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {stage.status === 'completed' ? 'Completed' :
                           stage.status === 'in-progress' ? 'In Progress' : 'Pending'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">{stage.duration}</p>
                      </CardContent>
                    </Card>

                    {/* Connection Arrow */}
                    {index < workflowStages.length - 1 && (
                      <div className="absolute top-16 left-full w-full flex items-center justify-center">
                        <ArrowRight className={`h-5 w-5 ${
                          stage.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                    )}

                    {/* Stage Details */}
                    <div className="text-center max-w-48">
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                      {stage.completedDate && (
                        <p className="text-xs text-green-600 mt-1">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {stage.completedDate}
                        </p>
                      )}
                      {stage.note && (
                        <p className="text-xs text-blue-600 mt-1 italic">{stage.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Workflow Activity
          </CardTitle>
          <CardDescription>
            Recent actions and updates on this vendor application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflowActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{activity.user}</span>
                    <Badge 
                      variant={
                        activity.status === 'completed' ? 'default' :
                        activity.status === 'progress' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Take action on this vendor application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Stage
            </Button>
            <Button variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Request More Info
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
            <Button variant="destructive" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}