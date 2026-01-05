import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Building2 } from "lucide-react";

interface AppointmentCardProps {
  clinicName: string;
  patientName: string;
  date: string;
  time: string;
}

export const AppointmentCard = ({ clinicName, patientName, date, time }: AppointmentCardProps) => {
  return (
    <Card className="p-6 space-y-4 bg-card border-border shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Clínica</p>
            <p className="font-semibold text-foreground">{clinicName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Paciente</p>
            <p className="font-semibold text-foreground">{patientName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold text-foreground">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-semibold text-foreground">{time}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
