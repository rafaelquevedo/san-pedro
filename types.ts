
export type GradeValue = 'AD' | 'A' | 'B' | 'C' | '';

export enum PeriodType {
  Bimestre = 'Bimestre',
  Trimestre = 'Trimestre'
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  name: string;
  subjectId: string;
  periodIndex: number; // 0-indexed period (e.g. 0 to 3 for bimesters)
  date: string;
}

export interface Grade {
  studentId: string;
  activityId: string;
  value: GradeValue;
}

export interface AppSettings {
  periodType: PeriodType;
  weights: {
    AD: number;
    A: number;
    B: number;
    C: number;
  };
}

export interface AppState {
  students: Student[];
  subjects: Subject[];
  activities: Activity[];
  grades: Grade[];
  settings: AppSettings;
}
