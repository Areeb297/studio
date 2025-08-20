import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee, AttendanceRecord } from "@/types/hr";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface AttendanceStatusWidgetProps {
  attendanceRecords: AttendanceRecord[];
  title?: string;
}

export function AttendanceStatusWidget({ 
  attendanceRecords,
  title = "Today's Attendance Status" 
}: AttendanceStatusWidgetProps) {
  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Late':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Absent':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Leave':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'default';
      case 'Late':
        return 'secondary';
      case 'Absent':
        return 'destructive';
      case 'Leave':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={record.employee.photo} alt={record.employee.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {record.employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{record.employee.name}</p>
                  <p className="text-xs text-muted-foreground">{record.employee.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {record.checkIn && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="text-sm font-medium">
                      {format(record.checkIn, 'HH:mm')}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <Badge variant={getStatusBadgeVariant(record.status)} className="text-xs">
                    {record.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          {attendanceRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No attendance records for today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}