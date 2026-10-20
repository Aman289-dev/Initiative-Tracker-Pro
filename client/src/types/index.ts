// Standard response envelope returned by the Express backend.
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// Initiative status options
export type InitiativeStatus = 'Not Started' | 'In Progress' | 'At Risk' | 'Completed' | 'On Hold';

// Initiative priority options
export type InitiativePriority = 'Low' | 'Medium' | 'High' | 'Critical';

// Initiative entity
export interface Initiative {
  _id: string;
  title: string;
  description?: string;
  owner: string;
  status: InitiativeStatus;
  priority: InitiativePriority;
  deadline: string; // ISO date string
  category?: string;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Data for creating/updating an initiative
export interface InitiativeFormData {
  title: string;
  description?: string;
  owner: string;
  status?: InitiativeStatus;
  priority?: InitiativePriority;
  deadline: string;
  category?: string;
  tags?: string[];
  progress?: number;
}

// Filter options for initiatives list
export interface InitiativeFilters {
  status?: InitiativeStatus | '';
  owner?: string;
  category?: string;
  search?: string;
}
