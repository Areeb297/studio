import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/types/hr";
import { Clock, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface EmployeeCardProps {
  employee: Employee;
  showStatus?: boolean;
  showContact?: boolean;
  onClick?: () => void;
}

export function EmployeeCard({ 
  employee, 
  showStatus = true, 
  showContact = false,
  onClick 
}: EmployeeCardProps) {
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'On Leave':
        return 'bg-yellow-500';
      case 'Resigned':
        return 'bg-gray-500';
      case 'Terminated':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEmploymentTypeBadge = (type: Employee['employmentType']) => {
    const variants = {
      'Full-time': 'default',
      'Part-time': 'secondary',
      'Contract': 'outline',
      'Probation': 'destructive'
    } as const;
    
    return variants[type] || 'default';
  };

  return (
    <Card 
      className={`transition-all hover:shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={employee.photo} alt={employee.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {showStatus && (
              <div 
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(employee.status)}`}
                title={employee.status}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm truncate">{employee.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                <p className="text-xs text-muted-foreground">{employee.department.name}</p>
              </div>
              <Badge 
                variant={getEmploymentTypeBadge(employee.employmentType)}
                className="text-xs"
              >
                {employee.employmentType}
              </Badge>
            </div>
            
            {showContact && (
              <div className="mt-2 space-y-1">
                {employee.email && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Joined {format(employee.hireDate, 'MMM yyyy')}</span>
              </div>
              {employee.performanceRating && (
                <div className="text-xs font-medium text-primary">
                  ★ {employee.performanceRating}/5
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}